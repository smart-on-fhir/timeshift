import FS     from "fs"
import Path   from "path"
import moment, { Moment } from "moment"

interface JSONObject {
    [key: string]: any
}

interface readDirOptions {
    recursive?: boolean
    filter?: RegExp | ((path: string) => boolean)
}

const PATH_MAP = {
    
    Patient: [
        "birthDate"
    ],
    Encounter: [
        "period.start",
        "period.end"
    ],
    Condition: [
        "onsetDateTime",
        "recordedDate"
    ],
    MedicationRequest: [
        "authoredOn"
    ],
    Claim: [
        "billablePeriod.start",
        "billablePeriod.end",
        "created"
    ],
    CarePlan: [
        "period.start",
        "period.end"
    ],
    ExplanationOfBenefit: [
        "billablePeriod.start",
        "billablePeriod.end",
        "billablePeriod.created"
    ]
};

/**
 * Tests if the given argument is an object
 * @param x The value to test
 */
function isObject(x: any): boolean {
    return !!x && typeof x == "object";
}

/**
 * Walks thru an object (ar array) and returns the value found at the
 * provided path. This function is very simple so it intentionally does not
 * support any argument polymorphism, meaning that the path can only be a
 * dot-separated string. If the path is invalid returns undefined.
 * @param obj The object (or Array) to walk through
 * @param [path=""] The path (eg. "a.b.4.c")
 * @returns Whatever is found in the path or undefined
 */
function getPath(obj: JSONObject, path: string = ""): any {
    return path.split(".").reduce((out, key) => out ? out[key] : undefined, obj);
}

/**
 * Finds a path in the given object and sets its value
 */
function setPath(obj: JSONObject, path: string | string[] | number, value: any): void {
    const segments = Array.isArray(path) ? path : String(path).split(".");

    if (!segments.length) {
        throw new Error("Path cannot be empty");
    }

    const key = segments.shift() as string;

    if (segments.length) {

        // Create intermediate object or array properties
        if (!obj.hasOwnProperty(key)) {
            if (segments[0].match(/^\d+$/)) {
                obj[key] = [];
            } else {
                obj[key] = {};
            }
        }

        // Step in
        return setPath(obj[key], segments, value);
    }

    if (obj.hasOwnProperty(key)) {
        const target         = obj[key];
        const sourceIsObject = isObject(value);
        const targetIsObject = isObject(target);

        if (sourceIsObject !== targetIsObject) {
            throw new Error(
                "Unable to merge incompatible objects" +
                " (array or object with scalar value)"
            );
        }

        if (Array.isArray(value) !== Array.isArray(target)) {
            throw new Error(
                "Unable to merge incompatible objects" +
                " (cannot mix arrays with objects)"
            );
        }
    }

    obj[key] = value;
}

function timeShift(input: string, amount: number, units: moment.DurationInputArg2): Moment {
    const inputMoment = moment(input);
    if (amount < 0) {
        inputMoment.subtract(Math.abs(amount), units);
    } else {
        inputMoment.add(amount, units);
    }
    return inputMoment;
}

/**
 * Walk a directory recursively and find files that match the @filter if its a
 * RegExp, or for which @filter returns true if its a function.
 * @param dir Path to directory
 * @param [options={}] Options to control the behavior
 * @returns {IterableIterator<String>}
 */
function* readDir(dir: string, options: readDirOptions = {}): IterableIterator<string> {
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

function transformPath(json: JSONObject, path: string, amount: number, units: moment.DurationInputArg2) {
    const input = getPath(json, path);
    if (input) {
        const format = String(input).match(/[^\d\-]/) ? undefined : "YYYY-MM-DD";
        setPath(json, path, timeShift(json.birthDate, amount, units).format(format));
    }
}

const transformers: { [key: string]: (json: JSONObject) => JSONObject } = {
    __passThrough__: json => json,

    

    Patient: json => {
        console.log(`${json.birthDate} - ${timeShift(json.birthDate, -1, "year").format("YYYY-MM-DD")}`)
        json.birthDate = timeShift(json.birthDate, -1, "year").format("YYYY-MM-DD");
        return json;
    }
};

/**
 * Walks a directory recursively in a synchronous fashion and yields JSON
 * objects. Only `.json` and `.ndjson` files are parsed. Yields ane JSON object
 * for each line of an NDJSON file and one object for each JSON file. Other
 * files are ignored.
 *
 * @param {String} dir A path to a directory
 */
function main(): void {
    const files = readDir("../R4", { recursive: true, filter: /\.json$/ });
    for (const file of files) {
        const json = JSON.parse(FS.readFileSync(file, "utf8"));
        if (Array.isArray(json.entry)) {
            json.entry.forEach((entry: JSONObject) => {
                const transform = transformers[entry.resource.resourceType];
                if (transform) {
                    // console.log(
                        transform(entry.resource)
                    // );
                }
            });
        }
    }
}


main()
