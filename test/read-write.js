const code = require("../lib/read-write");
const assert = require("assert");
const nock = require("nock");

const CLIENT_EMAIL = "test-account@fast-ability-145401.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwmz3cjee+in8k\nAnruXf/2q9VfgJfjykK2oDIkjUZJs61tPZyOeD3m+9Fqn62/vzAtvQVO9RzYlnH6\n/1hTl/NsNhd+kwehP230+NVwizfuzsVgsteVlSKHPgQs3uOLuBU4RIZE/KPzuWzS\nKO3bMVQb00Yo5G2MjEupA6cHx4ng0qUevYGdS9k+Z01Msx8Cw55nwibpLyZW1QEW\nKIfY9q31FIsgbjw3ODhM9Rtvy3lgbY/N02buzlKCb3Tz+plr/IAnkgVTwQJMvT2t\nr9BvWyHhArsbRPLNF35ZuHrT6/tnRt1pZbU9vGccIKFlBJ3vVZhFPiGIJF5EKVNt\nmtlE7cdnAgMBAAECggEACuhW3nlJov9enksK7A/HmdgZRYM/N+6+xq6UbXG0sb06\n5mBwrwbAWzSzxYz9yBx9hy2n/ZO7YUMorTk566I0aVTaVNNG6ULuJLwW23mCjfZp\nj8qr8JpCUWEKrl/7yzemekNKABb5SoadMOO3QRtfiv82OgG8JGFora32K7XuwmeV\n13/E/KeT8P9FfMh462Iakppty0OaXkL5KCZqq9l8+NizpxcbCqc/+P5y5MB2/tWY\n5jiooAIiyaSbeydgS+CX15+biLei6+QpKOlQTdGedVTTTt4Oh8tImhoh7Eha5Lge\nP15QRhFVgCsdb1iSxinuU0p24wcU4g7oyX7z9HsRDQKBgQDkMMBx9WnWOaBmDd6h\nvMc42ckrhsYTRS8LCYfvm+vjiudYeVAhQP3+M01qQOvgXyOe17BPJBlFmBDVKRWQ\nRyEnF8Dg4SmwuNuhWjAPE1wGg1E3yxgtkaFY3TLxKguNuuxQzBUdQ15ILlNkWxqY\nwdsZYiXF8+ySnUolEPYxH6V/LQKBgQDGISJ6bqDwPhiHgCCmV3jPbxVPV/me5ru/\nhg36GC9gg4iQEtwEjNQw3RIPR7gQ6axeWagw1ti4qSnc70n8SGBXBJTT2hg+JZTt\nn8MzHHbz6pmIsiN19o3oev0oxSMSb76Zkw1vxhnRPnOmiqAItfMwM50wHfGpXSCw\nL6qkmgudYwKBgGQ5qX0kLn1CSFoqw1tEoDgvJ/WvN3alT3lIkWVDlcMWcnBgsDo6\n4pRxEhKWO0QMZYfR8oWANH1lwhbt+aOqKjySaUwceYQ+XXEsPKmSdjwCF30q/g6d\nxUFTvplAP1zb+gmu6aM1wMZxWn1cqnznwIUQn8inT4RCA5vuLEP9Q2JtAoGABMw6\nnIJfTVIDoAxfPgfyOfuzpWc4+TsXIs0pO3wocYrd3LdIMqgCX2iLDmmrMGWoMeSz\n6PLa7qXSCLKWtRA/nPvUasjmO2MHlzV+MZen3cI5k5DUwP+GcjHAPaOAdOrVz7w6\n4BEJAQMlI8xJkcxuJiWp0cd32aUSrJGK7U95pocCgYEAt+ha8d650nwc+SjNd68G\nw/IwrNlCGWXSBwg7BR8VKWvoOxFokxxYOchozTu+b/9Y53fO5ZvtW0Zau57QzNU7\nPJYul8I0sMEAzsj0cEuIQEfV4YQ0l1plWkKaZStLIQ6eEWmwJ7Gx2XgOmKVQqD4/\nof4bdrk3H2Z81xUH4QTo18s=\n-----END PRIVATE KEY-----\n";
const SPREADSHEET_ID = "10SUCLi3IhEfbDYzEyJ5a4YyqdSyV5u_SpGYhrWzybr8";

describe("Reading", () => {
    describe("#getRows", () => {
        it("gets a collection of rows", (done) => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .get(/v4\/spreadsheets\/.*\/values:batchGet/)
                .reply(200, {
                    "spreadsheetId": SPREADSHEET_ID,
                    "valueRanges": [{
                        "range": "'People'!A2:B3",
                        "majorDimension": "ROWS",
                        "values": [
                            ["Kyle", "Coberly"],
                            ["Elyse", "Coberly"]
                        ]
                    },{
                        "range": "'Cities'!A2:A4",
                        "majorDimension": "ROWS",
                        "values": [
                            ["Denver"],
                            ["Seattle"]
                        ]
                    }]
                });
            code.getRows([{
                label: "people",
                range: "People!A2:B4",
                mapping: ["firstName", "lastName"]
            },{
                label: "cities",
                range: "Cities!A2:A4",
                mapping: ["city"]
            }],{
                spreadsheetId: SPREADSHEET_ID,
                clientEmail: CLIENT_EMAIL,
                privateKey: PRIVATE_KEY
            }).then(response => {
                assert.deepEqual(response, {
                    people: [{
                        firstName: "Kyle",
                        lastName: "Coberly"
                    },{
                        firstName: "Elyse",
                        lastName: "Coberly"
                    }],
                    cities: [{
                        city: "Denver"
                    },{
                        city: "Seattle"
                    }]
                });
            }).then(done)
            .catch(done);
        });
    });
});

describe("Writing", () => {
    describe("#updateRows", () => {
        it("updates a row", (done) => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values:batchUpdate/)
                .reply(201, {
                    totalUpdatedRows: 1
                });
            code.updateRows([{
                range: "A2:A",
                values: [["A"]]
            }],{
                spreadsheetId: SPREADSHEET_ID,
                clientEmail: CLIENT_EMAIL,
                privateKey: PRIVATE_KEY
            }).then(response => {
                assert.deepEqual(response, {updatedRows: 1});
            }).then(done)
            .catch(done);
        });
    });

    describe("#addRows", () => {
        it("appends a row", (done) => {
            nock("https://accounts.google.com")
                .post(/.*/)
                .reply(200, {
                    refresh_token: "a",
                    access_token: "b"
                });
            nock("https://sheets.googleapis.com")
                .post(/v4\/spreadsheets\/.*\/values\/\%27Form\%20Responses\%27\!A2\:B:append.*/)
                .reply(201, {
                    updates: {
                        updatedRows: 1
                    }
                });
            code.addRows("'Form Responses'!A2:B", [
                ["column 1", "column 2"],
                ["column 1", "column 2"]
            ], {
                spreadsheetId: SPREADSHEET_ID,
                clientEmail: CLIENT_EMAIL,
                privateKey: PRIVATE_KEY
            }).then(response => {
                assert.deepEqual(response, {updatedRows: 1});
            }).then(done)
            .catch(done);
        });
    });
});
