const code = require("../index");
const assert = require("assert");

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
describe("#rangesToArrays", ()=>{
    const ranges  = [{
        range: '\'Form Responses 1\'!A2:A1227',
        majorDimension: 'ROWS',
        values: [1, 2, 3]
    },{
        range: '\'Form Responses 1\'!C2:C1227',
        majorDimension: 'ROWS',
        values: [4, 5, 6]
    }];

    it("converts google sheets ranges to arrays", ()=>{
        assert.deepEqual(code.rangesToArrays(ranges), [[1, 2, 3], [4, 5, 6]]);
    });
});
describe("#arraysToMaps", ()=>{
    it("converts arrays to maps", ()=>{
        assert.deepEqual(code.arraysToMaps(["one", "two"], [[1, 2], [3, 4]]), [{one: 1, two: 2}, {one: 3, two: 4}]);
    });
    it("returns empty objects if the array doesn't have values", ()=>{
        assert.deepEqual(code.arraysToMaps([], [[], []]), [{}, {}]);
    });
});
