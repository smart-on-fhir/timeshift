#!/usr/bin/env node

const FS          = require("fs");
const { Command } = require("commander");
const { shift }   = require("./lib");


const APP = new Command();
APP.name("node .")
APP.usage("[options] input-directory output-directory");
APP.option('-a, --amount <number>', 'The shift amount as number (can also be negative)', parseInt);
APP.option('-u, --units [unit]', 'year, years, month, months, days, day etc.', "years");
APP.option('-v, --verbose', 'Log every transformation', false);
APP.description(
    "Reads JSON and XML files from input-directory, modifies all dates\nby shifting " +
    "them with the given amount and writes the results to\nthe output-directory."
);
APP.parse(process.argv);



function main()
{
    const args = [...APP.args];
    
    const INPUT_DIR = args.shift();
    if (!INPUT_DIR) {
        return APP.help();
    }
    if (!FS.existsSync(INPUT_DIR)) {
        console.error(`input-directory (${INPUT_DIR}) does not exist`);
        process.exit(1);
    }

    const OUTPUT_DIR = args.shift();
    if (!OUTPUT_DIR) {
        return APP.help();
    }
    if (!FS.existsSync(OUTPUT_DIR)) {
        console.error(`output-directory (${OUTPUT_DIR}) does not exist`);
        process.exit(1);
    }

    const options = APP.opts();

    shift({
        inputDir   : INPUT_DIR,
        outputDir  : OUTPUT_DIR,
        shiftAmount: options.amount,
        shiftUnits : options.units,
        verbose    : options.verbose
    });
}

main();
