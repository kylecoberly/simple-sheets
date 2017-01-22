require("dotenv").load();

var google = require("googleapis");
var sheets = google.sheets({
    version: "v4",
    auth: new google.auth.JWT(
        process.env.SHEETS_CLIENT_EMAIL,
        null,
        process.env.SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        null
    )
}).spreadsheets;

function getSurveyData(sheets, spreadsheetId, ranges, options){
    options = options || {};
    return new Promise(function(resolve, reject){
        sheets.values.batchGet({
            spreadsheetId,
            ranges,
            majorDimension: options.majorDimension || "COLUMNS",
            dateTimeRenderOption: options.dateTimeRenderOption || "FORMATTED_STRING"
        }, function(error, response){
            if (error){reject(error);}
            resolve(response);
        });
    });
}

module.exports = getSurveyData.bind(null, sheets);
