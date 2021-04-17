const FS       = require("fs");
const Path     = require("path");
const moment   = require("moment");
const sax      = require("sax");
const {
    jsonPaths,
    xmlPaths
} = require("./config");

const dateFormats = {
    instant: {
        re: /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}([+-]\d{2}:\d{2}|[zZ])\b/g,
        format: "YYYY-MM-DDTHH:mm:ss.SSSZ"
    },
    date: {
        // Note that we intentionally do NOT support partial
        // dates like YYYY or YYYY-MM
        re: /\b\d{4}-\d{2}-\d{2}\b/g,
        format: "YYYY-MM-DD"
    },
    dateTime: {
        // Note that we intentionally do NOT support partial
        // dates like YYYY or YYYY-MM
        re: /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|[zZ])\b/g,
        format: "YYYY-MM-DDTHH:mm:ssZ"
    }
};

// Low level and helper functions
// -----------------------------------------------------------------------------

function log(...args) {
    console.log(...args);
}

/**
 * Tests if the given argument is an object
 * @param {*} x The value to test
 * @returns {boolean}
 */
function isObject(x) {
    return !!x && typeof x == "object";
}

function xmlEscape(input) {
    return input
        .replace(/&(?!(amp|lt|gt);)/g, "&amp;")
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;");
}

/**
 * @param {string} input 
 * @param {number} amount 
 * @param {moment.DurationInputArg2} units
 * @returns {string} 
 */
function shiftDatesInText(input, amount, units)
{
    return input
        .replace(dateFormats.instant.re, all => timeShift(all, amount, units, dateFormats.instant.format))
        .replace(dateFormats.dateTime.re, all => timeShift(all, amount, units, dateFormats.dateTime.format))
        .replace(dateFormats.date.re, all => timeShift(all, amount, units, dateFormats.date.format));
}

/**
 * Walk a directory recursively and find files that match the @filter if its a
 * RegExp, or for which @filter returns true if its a function.
 * @param {string} dir Path to directory
 * @param {object} [options={}] Options to control the behavior
 * @param {boolean} [options.recursive]
 * @param {RegExp|(path:string) => boolean} [options.filter]
 * @returns {IterableIterator<String>}
 */
function* readDir(dir, options = {}) {
    const files = FS.readdirSync(dir);
    for (const file of files) {
        const pathToFile = Path.join(dir, file);
        const isDirectory = FS.statSync(pathToFile).isDirectory();
        if (isDirectory) {
            if (options.recursive === false) {
                continue;
            }
            yield *readDir(pathToFile, options);
        } else {
            if (options.filter instanceof RegExp && !options.filter.test(file)) {
                continue;
            }
            if (typeof options.filter == "function" && !options.filter(file)) {
                continue;
            }
            yield pathToFile;
        }
    }
}

function forEachFile(inputDir, callback)
{
    const dirPath = Path.resolve(inputDir);
    const files = readDir(dirPath, { recursive: true, filter: /\.(xml|json)$/ });
    for (const file of files) {
        callback(FS.readFileSync(file, "utf8"), file);
    }
}

/**
 * @param {string} input 
 * @returns {string}
 */
function getDateFormat(input) {
    switch (input.length) {
        case 2 : return "YY";
        case 4 : return "YYYY";
        case 7 : return "YYYY-MM";
        case 10: return "YYYY-MM-DD";
        case 19: return "YYYY-MM-DDTHH:mm:ssZ";
        default:
            return input.match(/T\d{2}:\d{2}:\d{2}\.\d{3,}/) ?
                "YYYY-MM-DDTHH:mm:ss.SSSZ" :
                "YYYY-MM-DDTHH:mm:ssZ";
    }
}

/**
 * Shifts a FHIR date-like input value with the given amount of time
 * @param {string} input 
 * @param {number} amount 
 * @param {moment.DurationInputArg2} units
 * @returns {string} 
 */
function timeShift(input, amount, units, format = null) {
    if (!format) {
        format = getDateFormat(input);
    }
    const inputMoment = moment.utc(input, true);
    if (amount < 0) {
        inputMoment.subtract(Math.abs(amount), units);
    } else {
        inputMoment.add(amount, units);
    }
    return inputMoment.format(format);
}



// XML functions
// -----------------------------------------------------------------------------

/**
 * @param {object} options
 * @param {string} options.input
 * @param {(path:string, value:any) => any)} options.onLeaf
 */
function transformXML({ input, onLeaf = (_, x) => x })
{
    const parser = sax.parser(true, { normalize: true, trim: true });

    let output = "";
    let depth = 0;
    let path = []

    function indent() {
        let out = ""
        for (let i = 0; i < depth; i++) {
            out += "  ";
        }
        return out
    }

    parser.onerror = e => { throw e; };

    parser.onprocessinginstruction = node => {
        output += `<?${node.name} ${node.body}?>\n`;
    };

    parser.onopentag = function({ name, attributes, isSelfClosing })
    {
        path.push(name);
        output += `${depth ? "\n" : ""}${indent()}<${name}`;
        for (let attrName in attributes) {
            output += ` ${attrName}="${onLeaf([...path, attrName].join("."), attributes[attrName])}"`;
        }
        if (isSelfClosing) {
            output += "/>";
        } else {
            output += ">";
            depth  += 1;
        }
    };

    parser.onclosetag = function(name) {
        path.pop();
        if (!parser.tag.isSelfClosing) {
            depth  -= 1;
            output += `\n${indent()}</${name}>`;
        }
    };

    parser.ontext = function(text) {
        output += `\n${indent()}${onLeaf(path.join("."), text)}`;
    };

    parser.write(input).close();

    return output;
}

// JSON functions
// -----------------------------------------------------------------------------

/**
 * Finds a path in the given object and calls the callback for each match
 * @param {object} obj
 * @param {string | string[] | number} path
 * @param {(parent: any, key: string, value: any, path: string) => any} callback
 * @param {string[]} [_pathSoFar = []]
 * @returns {void}
 */
function loopPath(obj, path, callback, _pathSoFar = []) {
    
    // The path can be an array of segments or a dot-separated path. When called
    // recursively it will be an array
    const segments = Array.isArray(path) ? path : String(path).split(".");

    // Empty path is not valid
    if (!segments.length) {
        throw new Error("Path cannot be empty");
    }

    // Get the current key
    const key = segments.shift();

    // Update the current path
    _pathSoFar.push(key);

    // Early exit if the path is trying to dive into scalar value
    if (segments.length && !isObject(obj)) {
        return;
    }

    // If this was the last path segment call the callback and exit
    if (!segments.length) {
        if (isObject(obj)) {
            callback(obj, key, obj[key], _pathSoFar.join("."));
        }
        return;
    }

    // Empty key means we are in ".." operator
    if (!key) {

        // The ".." operator is only valid for arrays. Trying to use it on
        // non-array node means no match, thus we can exit
        if (!Array.isArray(obj)) {
            return;
        }

        // Dive into the array
        return obj.forEach(entry => loopPath(entry, [...segments], callback, _pathSoFar));
    }

    // Step in
    if (segments.length) {
        return loopPath(obj[key], [...segments], callback, _pathSoFar);
    }

    if (isObject(obj) && key in obj) {
        callback(obj, key, obj[key], _pathSoFar.join("."));
    }
}

/**
 * @param {object} json
 * @param {number} shiftAmount
 * @param {moment.DurationInputArg2} shiftUnits
 * @param {(path: string, value: any) => any} transform
 */
function transformJSON(json, transform)
{
    if (json.resourceType === "Bundle") {
        json.entry = (json.entry || []).map(entry => {
            transformJSON(entry.resource, transform);
            return entry;
        });
        return json;
    }

    // Replace dates in text.div
    let val = json.text ? json.text.div : null;
    if (val) {
        json.text.div = transform("text.div", val);
        // log(" - " + json.resourceType + ".text.div: ", val, " => ", json.text.div);
    }

    const paths = jsonPaths[json.resourceType];
    if (paths) {
        paths.forEach(path => {
            loopPath(json, path, (prt, key, val, currentPath) => {
                if (val) {
                    prt[key] = transform(currentPath, val);
                    // log(" - " + json.resourceType + "." + currentPath, ": ", val, " => ", prt[key]);
                }
            });
        });
    } else {
        throw new Error(`No paths defined for "${json.resourceType}" resource type!`)
    }

    return json;
}

/**
 * @param {object} options 
 * @param {string} options.inputDir 
 * @param {string} options.outputDir
 * @param {number} options.shiftAmount
 * @param {moment.DurationInputArg2} options.shiftUnits
 * @param {boolean} verbose
 */
function shift(options)
{
    let transforms = 0;
    let startTime = Date.now();

    function processJSON(json, path) {
        log(`Processing JSON file ${path}`);
        save(path, JSON.stringify(
            transformJSON(json, (p, v) => {
                let newValue = v;
                if (p.match(/\btext\.div\b/)) {
                    newValue = shiftDatesInText(v, options.shiftAmount, options.shiftUnits);
                } else {
                    newValue = timeShift(v, options.shiftAmount, options.shiftUnits);
                }
                if (newValue !== v) {
                    transforms += 1;
                    options.verbose && log(p, ": ", v, " => ", newValue);
                }
                return newValue;
            }),
            null,
            4
        ));
    }

    function processXML(xml, path) {
        log(`Processing XML file ${path}`);
        save(path, transformXML({
            input: xml,
            onLeaf(path, value) {
                let newValue = value;
                if (xmlPaths.indexOf(path) > -1) {
                    newValue = xmlEscape(timeShift(value, options.shiftAmount, options.shiftUnits));
                } else if (path.match(/\.text\.div\b/)) {
                    newValue = xmlEscape(shiftDatesInText(value, options.shiftAmount, options.shiftUnits));
                } else if (!path.match(/Binary\.content\.value/)) {
                    newValue = xmlEscape(value);
                }
                if (newValue !== value) {
                    transforms += 1;
                    options.verbose && log(path, ": ", value, " => ", newValue);
                }
                return newValue;
            }
        }));
    }

    function save(path, data) {
        const dirPath = Path.resolve(options.inputDir);
        const dest = path.replace(dirPath, options.outputDir)
        FS.mkdirSync(Path.dirname(dest), { recursive: true });
        FS.writeFileSync(dest, data);
    }

    function processFile(contents, path) {
        if (path.endsWith(".json")) {
            processJSON(JSON.parse(contents), path);
        }
        else if (path.endsWith(".xml")) {
            processXML(contents, path);
        }
    }

    forEachFile(Path.resolve(options.inputDir), processFile);

    console.log(`Shifted ${Number(transforms).toLocaleString("en-US")} dates in ${Math.round((Date.now() - startTime)/1000)} seconds`);
};

module.exports = {
    shift,
    shiftDatesInText,
    transformXML,
    transformJSON,
    getDateFormat,
    timeShift
};
