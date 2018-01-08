const assert = require("assert");
const code = require("../lib/auth");

describe("Auth", () => {
    describe("#_sheets", () => {
        it("exports a batchGet, batchUpdate, and an append function", () => {
            const sheets = code._sheets();
            assert.ok(sheets.batchGet);
            assert.ok(sheets.batchUpdate);
            assert.ok(sheets.append);
        });
    });
});
