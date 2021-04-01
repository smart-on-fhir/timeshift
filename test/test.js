const Code = require('@hapi/code');
const Lab  = require('@hapi/lab');
// const moment = require("moment");
const {
    shiftDatesInText,
    transformJSON,
    getDateFormat,
    transformXML,
    timeShift
} = require("../lib");

const { expect } = Code;
const { it, describe } = exports.lab = Lab.script();


describe("getDateFormat", () => {
    it ("YYYY", () => {
        expect(getDateFormat("1234")).to.equal("YYYY");
    });
    it ("YYYY-MM", () => {
        expect(getDateFormat("1234-11")).to.equal("YYYY-MM");
    });
    it ("YYYY-MM-DD", () => {
        expect(getDateFormat("1234-11-23")).to.equal("YYYY-MM-DD");
    });
    it ("YYYY-MM-DDTHH:mm:ssZ", () => {
        expect(getDateFormat("1234-11-23T12:13:14")).to.equal("YYYY-MM-DDTHH:mm:ssZ");
        expect(getDateFormat("1234-11-23T12:13:14+03:00")).to.equal("YYYY-MM-DDTHH:mm:ssZ");
    });
    it ("YYYY-MM-DDTHH:mm:ss.SSSZ", () => {
        expect(getDateFormat("1234-11-23T12:13:14.200")).to.equal("YYYY-MM-DDTHH:mm:ss.SSSZ");
        expect(getDateFormat("1234-11-23T12:13:14.200+03:00")).to.equal("YYYY-MM-DDTHH:mm:ss.SSSZ");
    });
});

describe("shiftDatesInText", () => {
    it ("single date", () => {
        expect(shiftDatesInText("a 2020-05-05 b", -1, "days"  )).to.equal("a 2020-05-04 b");
        expect(shiftDatesInText("a 2020-05-05 b", +1, "days"  )).to.equal("a 2020-05-06 b");
        expect(shiftDatesInText("a 2020-05-05 b", -1, "months")).to.equal("a 2020-04-05 b");
        expect(shiftDatesInText("a 2020-05-05 b", +1, "months")).to.equal("a 2020-06-05 b");
        expect(shiftDatesInText("a 2020-05-05 b", -1, "years" )).to.equal("a 2019-05-05 b");
        expect(shiftDatesInText("a 2020-05-05 b", +1, "years" )).to.equal("a 2021-05-05 b");
    });

    it ("multiple date", () => {
        expect(shiftDatesInText("a 2020-05-05 2030-05-05 b", -1, "days"  )).to.equal("a 2020-05-04 2030-05-04 b");
        expect(shiftDatesInText("a 2020-05-05 2030-05-05 b", +1, "days"  )).to.equal("a 2020-05-06 2030-05-06 b");
        expect(shiftDatesInText("a 2020-05-05 2030-05-05 b", -1, "months")).to.equal("a 2020-04-05 2030-04-05 b");
        expect(shiftDatesInText("a 2020-05-05 2030-05-05 b", +1, "months")).to.equal("a 2020-06-05 2030-06-05 b");
        expect(shiftDatesInText("a 2020-05-05 2030-05-05 b", -1, "years" )).to.equal("a 2019-05-05 2029-05-05 b");
        expect(shiftDatesInText("a 2020-05-05 2030-05-05 b", +1, "years" )).to.equal("a 2021-05-05 2031-05-05 b");
    });


    it ("single instant", () => {
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 b", -1, "days"  ))
                      .to.equal("a 2020-05-04T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 b", +1, "days"  ))
                      .to.equal("a 2020-05-06T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 b", -1, "months"))
                      .to.equal("a 2020-04-05T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 b", +1, "months"))
                      .to.equal("a 2020-06-05T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 b", -1, "years" ))
                      .to.equal("a 2019-05-05T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 b", +1, "years" ))
                      .to.equal("a 2021-05-05T12:00:00.100+00:00 b");
    });

    it ("multiple instant", () => {
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 2120-05-05T12:00:00.100+00:00 b", -1, "days"  ))
                      .to.equal("a 2020-05-04T12:00:00.100+00:00 2120-05-04T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 2120-05-05T12:00:00.100+00:00 b", +1, "days"  ))
                      .to.equal("a 2020-05-06T12:00:00.100+00:00 2120-05-06T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 2120-05-05T12:00:00.100+00:00 b", -1, "months"))
                      .to.equal("a 2020-04-05T12:00:00.100+00:00 2120-04-05T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 2120-05-05T12:00:00.100+00:00 b", +1, "months"))
                      .to.equal("a 2020-06-05T12:00:00.100+00:00 2120-06-05T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 2120-05-05T12:00:00.100+00:00 b", -1, "years" ))
                      .to.equal("a 2019-05-05T12:00:00.100+00:00 2119-05-05T12:00:00.100+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00.100+00:00 2120-05-05T12:00:00.100+00:00 b", +1, "years" ))
                      .to.equal("a 2021-05-05T12:00:00.100+00:00 2121-05-05T12:00:00.100+00:00 b");
    });

    it ("single dateTime", () => {
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 b", -1, "days"  ))
                      .to.equal("a 2020-05-04T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 b", +1, "days"  ))
                      .to.equal("a 2020-05-06T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 b", -1, "months"))
                      .to.equal("a 2020-04-05T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 b", +1, "months"))
                      .to.equal("a 2020-06-05T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 b", -1, "years" ))
                      .to.equal("a 2019-05-05T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 b", +1, "years" ))
                      .to.equal("a 2021-05-05T12:00:00+00:00 b");
    });

    it ("multiple dateTime", () => {
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 2120-05-05T12:00:00+00:00 b", -1, "days"  ))
                      .to.equal("a 2020-05-04T12:00:00+00:00 2120-05-04T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 2120-05-05T12:00:00+00:00 b", +1, "days"  ))
                      .to.equal("a 2020-05-06T12:00:00+00:00 2120-05-06T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 2120-05-05T12:00:00+00:00 b", -1, "months"))
                      .to.equal("a 2020-04-05T12:00:00+00:00 2120-04-05T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 2120-05-05T12:00:00+00:00 b", +1, "months"))
                      .to.equal("a 2020-06-05T12:00:00+00:00 2120-06-05T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 2120-05-05T12:00:00+00:00 b", -1, "years" ))
                      .to.equal("a 2019-05-05T12:00:00+00:00 2119-05-05T12:00:00+00:00 b");
        expect(shiftDatesInText("a 2020-05-05T12:00:00+00:00 2120-05-05T12:00:00+00:00 b", +1, "years" ))
                      .to.equal("a 2021-05-05T12:00:00+00:00 2121-05-05T12:00:00+00:00 b");
    });

    it ("mixed use", () => {
        expect(shiftDatesInText("a 2020-05-05T12:00:00.200+00:00 2120-05-05T12:00:00+00:00 2021-06-05 b", -1, "days"))
                      .to.equal("a 2020-05-04T12:00:00.200+00:00 2120-05-04T12:00:00+00:00 2021-06-04 b");
    });
});

describe("timeShift", () => {
    it ("single date", () => {
        expect(timeShift("2020-05-05", -1, "days"  )).to.equal("2020-05-04");
        expect(timeShift("2020-05-05", +1, "days"  )).to.equal("2020-05-06");
        expect(timeShift("2020-05-05", -1, "months")).to.equal("2020-04-05");
        expect(timeShift("2020-05-05", +1, "months")).to.equal("2020-06-05");
        expect(timeShift("2020-05-05", -1, "years" )).to.equal("2019-05-05");
        expect(timeShift("2020-05-05", +1, "years" )).to.equal("2021-05-05");
    });

    it ("single instant", () => {
        expect(timeShift("2020-05-05T12:00:00.100+00:00", -1, "days"  )).to.equal("2020-05-04T12:00:00.100+00:00");
        expect(timeShift("2020-05-05T12:00:00.100+00:00", +1, "days"  )).to.equal("2020-05-06T12:00:00.100+00:00");
        expect(timeShift("2020-05-05T12:00:00.100+00:00", -1, "months")).to.equal("2020-04-05T12:00:00.100+00:00");
        expect(timeShift("2020-05-05T12:00:00.100+00:00", +1, "months")).to.equal("2020-06-05T12:00:00.100+00:00");
        expect(timeShift("2020-05-05T12:00:00.100+00:00", -1, "years" )).to.equal("2019-05-05T12:00:00.100+00:00");
        expect(timeShift("2020-05-05T12:00:00.100+00:00", +1, "years" )).to.equal("2021-05-05T12:00:00.100+00:00");
    });

    it ("dateTime", () => {
        expect(timeShift("2020-05-05T12:00:00+00:00", -1, "days"  )).to.equal("2020-05-04T12:00:00+00:00");
        expect(timeShift("2020-05-05T12:00:00+00:00", +1, "days"  )).to.equal("2020-05-06T12:00:00+00:00");
        expect(timeShift("2020-05-05T12:00:00+00:00", -1, "months")).to.equal("2020-04-05T12:00:00+00:00");
        expect(timeShift("2020-05-05T12:00:00+00:00", +1, "months")).to.equal("2020-06-05T12:00:00+00:00");
        expect(timeShift("2020-05-05T12:00:00+00:00", -1, "years" )).to.equal("2019-05-05T12:00:00+00:00");
        expect(timeShift("2020-05-05T12:00:00+00:00", +1, "years" )).to.equal("2021-05-05T12:00:00+00:00");
    });
});

describe("transformXML", () => {
    it ("Works as expected", () => {
        const inputXML = '<a>' +
            '<b date="2020-01-01"/>' +
            '<c date="2020-01-01T23:22:21"/>' +
            '<d date="2020-01-01T23:22:21+00:00"/>' +
            '<x date="2020-01-01T23:22:21.222+00:00"/>' +
            '<e>' +
                '<f date="2020-01-01"/>' +
                '<f date="2020-01-01"/>' +
                '<f date="2020-01-01"/>' +
            '</e>' +
            '<text><div>Encounter on 2020-01-01T23:22:21.222+00:00</div></text>' +
        '</a>';

        expect(transformXML({
            input: inputXML,
            onLeaf: (path, value) => {
                if (path.match(/\.text\.div\b/)) {
                    return shiftDatesInText(value, 1, "day");
                }
                return timeShift(value, 1, "day");
            }
        })).to.equal(
`<a>
  <b date="2020-01-02"/>
  <c date="2020-01-02T23:22:21+00:00"/>
  <d date="2020-01-02T23:22:21+00:00"/>
  <x date="2020-01-02T23:22:21.222+00:00"/>
  <e>
    <f date="2020-01-02"/>
    <f date="2020-01-02"/>
    <f date="2020-01-02"/>
  </e>
  <text>
    <div>
      Encounter on 2020-01-02T23:22:21.222+00:00
    </div>
  </text>
</a>`
        );        
    });
});

describe("transformJSON", () => {
    it ("Works as expected", () => {

        const inputJSON = {
            resourceType: "Patient",
            birthDate: "2020-01-02",
            deceasedDateTime: "2020-01-02T23:22:21.222+00:00",
            text: {
                div: "Encounter on 2020-01-02T23:22:21.222+00:00"
            }
        };
        
        expect(transformJSON(inputJSON, (path, value) => {
            if (path.match(/\btext\.div\b/)) {
                return shiftDatesInText(value, 1, "day");
            }
            return timeShift(value, 1, "day");
        })).to.equal({
            resourceType: "Patient",
            birthDate: "2020-01-03",
            deceasedDateTime: "2020-01-03T23:22:21.222+00:00",
            text: {
                div: "Encounter on 2020-01-03T23:22:21.222+00:00"
            }
        });
    });
});
