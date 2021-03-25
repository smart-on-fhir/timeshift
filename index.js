const FS       = require("fs");
const APP      = require("commander");
const { shit } = require("./lib");


APP.name("ts-node .");
APP.usage("input-directory output-directory [options]");
APP.option('-a, --amount <number>', 'The shift amount as number (can also be negative)', parseInt);
APP.option('-u, --units [unit]', 'year, years, month, months, days, day etc.');
APP.description(
`Reads JSON files from input-directory, modifies all dates by shifting them with
the given amount and writes the results to the output-directory.`);
APP.parse(process.argv);



function main() {
    
    const INPUT_DIR = APP.args.shift();
    if (!INPUT_DIR) {
        return void APP.usage();
    }
    if (!FS.existsSync(INPUT_DIR)) {
        console.error(`input-directory (${INPUT_DIR}) does not exist`);
        process.exit(1);
    }

    const OUTPUT_DIR = APP.args.shift();
    if (!OUTPUT_DIR) {
        return void APP.usage();
    }
    if (!FS.existsSync(OUTPUT_DIR)) {
        console.error(`output-directory (${OUTPUT_DIR}) does not exist`);
        process.exit(1);
    }

    shit({
        inputDir   : INPUT_DIR,
        outputDir  : OUTPUT_DIR,
        shiftAmount: APP.amount,
        shiftUnits : APP.units
    });
}

main();
