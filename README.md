# timeshift
Shift dates in FHIR datasets

This tool was created to correct the fact that once generated, patients are
getting older in time. While that is normal for any typical FHIR server, it is
a problem for our sandbox servers which are filled in with sample patient data.

The script will get an input directory walk it recursively, find any JSON FHIR
resource and shift any date, datetime or instant value by the given amount of
time. It will then write the output to the given output directory.

### Installation
Make sure you have NodeJS installed and run:
```sh
git clone https://github.com/smart-on-fhir/timeshift.git
cd timeshift
npm i
```

### Usage
`cd` into the project directory and run it like so
```sh
node . -a -365 -u days ../generated-sample-data/ ./output
```
In this case any JSON files from `../generated-sample-data/` will be processed,
all dates will be shifted back with 365 days and the results will be written
to `./output`.