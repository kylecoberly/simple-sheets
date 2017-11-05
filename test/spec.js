const code = require("../index");
const assert = require("assert");

describe("#sheetsToMappedObject", ()=>{
    it("converts a google sheets response to a mapped object", ()=>{
        const fixture = {
            "spreadsheetId": "10SUCLi3IhEfbDYzEyJ5a4YyqdSyV5u_SpGYhrWzybr8",
            "valueRanges": [{
                "range": "'Project Submissions'!A2:B4",
                "majorDimension": "ROWS",
                "values": [
                    [
                        "10/17/2017 12:11:21",
                        "17"
                    ],
                    [
                        "10/17/2017 12:12:18",
                        "15"
                    ],
                    [
                        "10/17/2017 13:02:11",
                        "7"
                    ]
                ]
            },{
                "range": "'Project Submissions'!C2:C3",
                "majorDimension": "ROWS",
                "values": [
                    [
                        "Kevin Kingdon"
                    ],
                    [
                        "Jay Farnsworth"
                    ]
                ]
            }]
        };
        assert.deepEqual(code.sheetsToMappedObject([["date", "id"],["name"]], fixture), [
            [{
                date: "10/17/2017 12:11:21",
                id: "17",
            },{
                date: "10/17/2017 12:12:18",
                id: "15",
            },{
                date: "10/17/2017 13:02:11",
                id: "7",
            }],[{
                name: "Kevin Kingdon"
            },{
                name: "Jay Farnsworth"
            }]
        ]);
    });
});
describe("#arrayToObject", ()=>{
    it("converts a google sheets array to an object", ()=>{
        const result = code.arrayToObject(["keyOne", "keyTwo"], ["valueOne", "valueTwo"]);
        assert.deepEqual(result, {
            keyOne: "valueOne",
            keyTwo: "valueTwo"
        });
    });
    it("returns an empty object if there are no keys", ()=>{
        assert.deepEqual(code.arrayToObject([], ["valueOne", "valueTwo"]), {});
        assert.deepEqual(code.arrayToObject(null, ["valueOne", "valueTwo"]), {});
    });
    it("returns an empty object if there are no values", ()=>{
        assert.deepEqual(code.arrayToObject(["keyOne", "keyTwo"], []), {});
        assert.deepEqual(code.arrayToObject(["keyOne", "keyTwo"], null), {});
    });
    it("returns an empty object if there are no keys or values", ()=>{
        assert.deepEqual(code.arrayToObject([], []), {});
        assert.deepEqual(code.arrayToObject([], null), {});
        assert.deepEqual(code.arrayToObject(null, []), {});
        assert.deepEqual(code.arrayToObject(null, null), {});
    });
});

describe("#arraysToMaps", ()=>{
    it("converts arrays to maps", ()=>{
        assert.deepEqual(code.arraysToMaps(
            [["one", "two"],["three"]],
            [[[1, 2], [3, 4]], [[5]]]
        ),
            [
                [{ one: 1, two: 2},{one: 3, two: 4}],
                [{three: 5}]
            ]
        );
    });
    it("returns empty objects if the array doesn't have values", ()=>{
        assert.deepEqual(code.arraysToMaps([], [[], []]), [{}, {}]);
    });
});

describe("#arrayToMap", ()=>{
    it("converts an array to a map", ()=>{
        assert.deepEqual(code.arrayToMap(["one", "two"], [[1, 2], [3, 4]]), [{one: 1, two: 2}, {one: 3, two: 4}]);
    });
    it("returns empty objects if the array doesn't have values", ()=>{
        assert.deepEqual(code.arrayToMap([], [[], []]), [{}, {}]);
    });
});

describe("#getValueRanges", ()=>{
    it("extracts the value ranges from a sheets response", ()=>{
        const sheetsResponse = {
            "spreadsheetId": "10SUCLi3IhEfbDYzEyJ5a4YyqdSyV5u_SpGYhrWzybr8",
            "valueRanges": [{
                "range": "'Project Submissions'!A2:B4",
                "majorDimension": "ROWS",
                "values": [[
                    "a",
                    1
                ],[
                    "b",
                    2
                ]]
            },{
                "range": "'Project Submissions'!A2:B4",
                "majorDimension": "ROWS",
                "values": [[
                    "c",
                    3
                ],[
                    "d",
                    4
                ]]
            }]
        };
        assert.deepEqual(code.getValueRanges(sheetsResponse), [[["a", 1],["b", 2]],[["c", 3],["d", 4]]]);
    });
});
