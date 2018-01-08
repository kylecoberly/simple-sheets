const assert = require("assert");
const nock = require("nock");
const {getRows} = require("../lib/read-write");
const seeds = require("../lib/seeds");
const OPTIONS = {
    spreadsheetId: "10SUCLi3IhEfbDYzEyJ5a4YyqdSyV5u_SpGYhrWzybr8",
    clientEmail: "test-account@fast-ability-145401.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwmz3cjee+in8k\nAnruXf/2q9VfgJfjykK2oDIkjUZJs61tPZyOeD3m+9Fqn62/vzAtvQVO9RzYlnH6\n/1hTl/NsNhd+kwehP230+NVwizfuzsVgsteVlSKHPgQs3uOLuBU4RIZE/KPzuWzS\nKO3bMVQb00Yo5G2MjEupA6cHx4ng0qUevYGdS9k+Z01Msx8Cw55nwibpLyZW1QEW\nKIfY9q31FIsgbjw3ODhM9Rtvy3lgbY/N02buzlKCb3Tz+plr/IAnkgVTwQJMvT2t\nr9BvWyHhArsbRPLNF35ZuHrT6/tnRt1pZbU9vGccIKFlBJ3vVZhFPiGIJF5EKVNt\nmtlE7cdnAgMBAAECggEACuhW3nlJov9enksK7A/HmdgZRYM/N+6+xq6UbXG0sb06\n5mBwrwbAWzSzxYz9yBx9hy2n/ZO7YUMorTk566I0aVTaVNNG6ULuJLwW23mCjfZp\nj8qr8JpCUWEKrl/7yzemekNKABb5SoadMOO3QRtfiv82OgG8JGFora32K7XuwmeV\n13/E/KeT8P9FfMh462Iakppty0OaXkL5KCZqq9l8+NizpxcbCqc/+P5y5MB2/tWY\n5jiooAIiyaSbeydgS+CX15+biLei6+QpKOlQTdGedVTTTt4Oh8tImhoh7Eha5Lge\nP15QRhFVgCsdb1iSxinuU0p24wcU4g7oyX7z9HsRDQKBgQDkMMBx9WnWOaBmDd6h\nvMc42ckrhsYTRS8LCYfvm+vjiudYeVAhQP3+M01qQOvgXyOe17BPJBlFmBDVKRWQ\nRyEnF8Dg4SmwuNuhWjAPE1wGg1E3yxgtkaFY3TLxKguNuuxQzBUdQ15ILlNkWxqY\nwdsZYiXF8+ySnUolEPYxH6V/LQKBgQDGISJ6bqDwPhiHgCCmV3jPbxVPV/me5ru/\nhg36GC9gg4iQEtwEjNQw3RIPR7gQ6axeWagw1ti4qSnc70n8SGBXBJTT2hg+JZTt\nn8MzHHbz6pmIsiN19o3oev0oxSMSb76Zkw1vxhnRPnOmiqAItfMwM50wHfGpXSCw\nL6qkmgudYwKBgGQ5qX0kLn1CSFoqw1tEoDgvJ/WvN3alT3lIkWVDlcMWcnBgsDo6\n4pRxEhKWO0QMZYfR8oWANH1lwhbt+aOqKjySaUwceYQ+XXEsPKmSdjwCF30q/g6d\nxUFTvplAP1zb+gmu6aM1wMZxWn1cqnznwIUQn8inT4RCA5vuLEP9Q2JtAoGABMw6\nnIJfTVIDoAxfPgfyOfuzpWc4+TsXIs0pO3wocYrd3LdIMqgCX2iLDmmrMGWoMeSz\n6PLa7qXSCLKWtRA/nPvUasjmO2MHlzV+MZen3cI5k5DUwP+GcjHAPaOAdOrVz7w6\n4BEJAQMlI8xJkcxuJiWp0cd32aUSrJGK7U95pocCgYEAt+ha8d650nwc+SjNd68G\nw/IwrNlCGWXSBwg7BR8VKWvoOxFokxxYOchozTu+b/9Y53fO5ZvtW0Zau57QzNU7\nPJYul8I0sMEAzsj0cEuIQEfV4YQ0l1plWkKaZStLIQ6eEWmwJ7Gx2XgOmKVQqD4/\nof4bdrk3H2Z81xUH4QTo18s=\n-----END PRIVATE KEY-----\n"
};

describe("seeds", () => {
    describe("#clearSheet", () => {
        it("clears a sheet", done => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .twice()
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .get(/v4\/spreadsheets\/.*\/values:batchGet/)
                .reply(200, {
                    "spreadsheetId": OPTIONS.SPREADSHEET_ID,
                    "valueRanges": [{
                        "range": "'Student Queue'!A2:ZZ1000",
                        "majorDimension": "ROWS",
                        "values": [
                            ["", ""],
                            ["", ""]
                        ]
                    }]
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values:batchUpdate/)
                .reply(201, {
                    totalUpdatedRows: 1
                });
            const mapping = ["column1", "column2"];
            seeds.clearSheet("Student Queue", OPTIONS).then(() => {
                return getRows([{
                    label: "studentQueue",
                    range: "'Student Queue'!A2:ZZ1000",
                    mapping
                }], OPTIONS);
            }).then(response => {
                return response.studentQueue.forEach(queueItem => {
                    mapping.forEach(column => {
                        assert.equal(!!queueItem[column], false);
                    });
                });
            }).then(done)
            .catch(done);
        }).timeout(5000);
    });
    describe("#clearSheets", () => {
        it("clears multiple sheets", done => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .thrice()
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values:batchUpdate/)
                .twice()
                .reply(201, {
                    totalUpdatedRows: 2
                });
            nock("https://sheets.googleapis.com")
                .get(/v4\/spreadsheets\/.*\/values:batchGet/)
                .reply(200, {
                    "spreadsheetId": OPTIONS.SPREADSHEET_ID,
                    "valueRanges": [{
                        "range": "Sheet1!A2:ZZ1000",
                        "majorDimension": "ROWS",
                        "values": [
                            ["", ""],
                            ["", ""]
                        ]
                    },{
                        "range": "Sheet2!A2:ZZ1000",
                        "majorDimension": "ROWS",
                        "values": [
                            ["", ""],
                            ["", ""]
                        ]
                    }]
                });
            const sheet1Mapping = ["a", "b"];
            const sheet2Mapping = ["c", "d"];
            seeds.clearSheets(["Sheet1", "Sheet2"], OPTIONS).then(() => {
                return getRows([{
                    label: "sheet1",
                    range: "Sheet1!A2:ZZ1000",
                    mapping: sheet1Mapping
                },{
                    label: "sheet2",
                    range: "Sheet2!A2:ZZ1000",
                    mapping: sheet2Mapping
                }], OPTIONS);
            }).then(response => {
                response.sheet1.forEach(queueItem => {
                    sheet1Mapping.forEach(column => {
                        assert.equal(!!queueItem[column], false);
                    });
                });
                response.sheet2.forEach(cohort => {
                    sheet2Mapping.forEach(column => {
                        assert.equal(!!cohort[column], false);
                    });
                });
                done();
            }).catch(done);
        }).timeout(5000);
    });
    describe("#seedSheet", () => {
        it("seeds a sheet", done => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .twice()
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values:batchUpdate/)
                .reply(201, {
                    totalUpdatedRows: 2
                });
            nock("https://sheets.googleapis.com")
                .get(/v4\/spreadsheets\/.*\/values:batchGet/)
                .reply(200, {
                    "spreadsheetId": OPTIONS.SPREADSHEET_ID,
                    "valueRanges": [{
                        "range": "Label!A2:ZZ1000",
                        "majorDimension": "ROWS",
                        "values": [
                            ["a", "b"],
                            ["c", "d"]
                        ]
                    }]
                });
            const mapping = ["column1", "column2"];
            seeds.seedSheet("Label", mapping, [{
                column1: "a",
                column2: "b",
            },{
                column1: "c",
                column2: "d",
            }], OPTIONS).then(response => {
                return getRows([{
                    label: "label",
                    range: "Label!A2:B3",
                    mapping
                }], OPTIONS);
            }).then(response => {
                assert.deepEqual(response.label[0], {
                    column1: "a",
                    column2: "b"
                });
                done();
            }).catch(done);
        }).timeout(5000);
    });
    describe("#seedSheets", () => {
        it("seeds sheets", done => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .thrice()
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values:batchUpdate/)
                .reply(201, {
                    totalUpdatedRows: 2
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values:batchUpdate/)
                .reply(201, {
                    totalUpdatedRows: 1
                });
            nock("https://sheets.googleapis.com")
                .get(/v4\/spreadsheets\/.*\/values:batchGet/)
                .reply(200, {
                    "spreadsheetId": OPTIONS.SPREADSHEET_ID,
                    "valueRanges": [{
                        "range": "Sheet1!A2:ZZ1000",
                        "majorDimension": "ROWS",
                        "values": [
                            ["a", "b"],
                            ["c", "d"]
                        ]
                    },{
                        "range": "Sheet2!A2:ZZ1000",
                        "majorDimension": "ROWS",
                        "values": [
                            ["e", "f"]
                        ]
                    }]
                });

            const sheet1Mapping = ["column1", "column2"];
            const sheet2Mapping = ["column3", "column4"];

            seeds.seedSheets([{
                sheetName: "Sheet1",
                mapping: sheet1Mapping,
                seedData: [{
                    column1: "a",
                    column2: "b"
                },{
                    column1: "c",
                    column2: "d"
                }]
            },{
                sheetName: "Sheet2",
                mapping: sheet2Mapping,
                seedData: [{
                    column3: "e",
                    column4: "f"
                }]
            }], OPTIONS).then(response => {
                return getRows([{
                    label: "sheet1",
                    range: "Sheet1!A2:B3",
                    mapping: sheet1Mapping
                },{
                    label: "sheet2",
                    range: "Sheet2!A2:A3",
                    mapping: sheet2Mapping
                }], OPTIONS);
            }).then(response => {
                assert.deepEqual(response.sheet1[0], {
                    column1: "a",
                    column2: "b"
                });
                assert.deepEqual(response.sheet2[0], {
                    column3: "e",
                    column4: "f"
                });
                done();
            }).catch(done);
        }).timeout(5000);
    });
});
