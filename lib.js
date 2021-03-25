const FS       = require("fs");
const Path     = require("path");
const moment   = require("moment");
const PATH_MAP = require("./config");


/**
 * Tests if the given argument is an object
 * @param {*} x The value to test
 * @returns {boolean}
 */
function isObject(x) {
    return !!x && typeof x == "object";
}

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

/**
 * Shifts a FHIR date-like input value with the given amount of time
 * @param {string} input 
 * @param {number} amount 
 * @param {moment.DurationInputArg2} units
 * @returns {string} 
 */
function timeShift(input, amount, units) {
    const inputMoment = moment(input);
    if (amount < 0) {
        inputMoment.subtract(Math.abs(amount), units);
    } else {
        inputMoment.add(amount, units);
    }
    return inputMoment.format(getDateFormat(input));
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
        default: return "YYYY-MM-DDTHH:mm:ssZ";
    }
}

/**
 * @param {string} path
 * @param {object} data
 */
function writeJSON(path, data)
{
    FS.writeFileSync(path, JSON.stringify(data, null, 4));
}

/**
 * @param {string} inputDir 
 * @param {(json: object, path: string) => any} callback 
 */
function forEachJSONFile(inputDir, callback)
{
    const dirPath = Path.resolve(inputDir);
    const files = readDir(dirPath, { recursive: true, filter: /\.json$/ });
    for (const file of files) {
        callback(JSON.parse(FS.readFileSync(file, "utf8")), file);
    }
}

/**
 * @param {object} options 
 * @param {string} options.inputDir 
 * @param {string} options.outputDir
 * @param {number} options.shiftAmount
 * @param {moment.DurationInputArg2} options.shiftUnits
 */
exports.shit = function(options)
{
    let transforms = 0;

    function processResource(resource) {
        const paths = PATH_MAP[resource.resourceType];
        if (paths) {
            paths.forEach(path => {
                loopPath(resource, path, (prt, key, val, currentPath) => {
                    if (val) {
                        prt[key] = timeShift(val, options.shiftAmount, options.shiftUnits);
                        console.log(" - " + resource.resourceType + "." + currentPath, ": ", val, " => ", prt[key])
                        transforms += 1;
                    }
                })
            })
        } else {
            throw new Error(`No paths defined for "${resource.resourceType}" resource type!`)
        }
    }

    function processFile(json, path) {
        console.log(path, json.resourceType);
        if (json.resourceType === "Bundle") {
            (json.entry || []).forEach(entry => processResource(entry.resource));
        } else {
            processResource(json);
        }
        
        const dirPath = Path.resolve(options.inputDir);
        const dest = path.replace(dirPath, options.outputDir)
        FS.mkdirSync(Path.dirname(dest), { recursive: true });
        writeJSON(dest, json);
    }

    forEachJSONFile(Path.resolve(options.inputDir), processFile);

    console.log(`Shifted ${transforms} dates`);
};
