const google = require("googleapis");

function getRows(ranges, mappings, options){
    return new Promise(function(resolve, reject){
        if (!ranges || !ranges.length){
            reject("Need valid ranges");
        }
        if (!mappings || !mappings.length){
            reject("Need valid mappings");
        }
        if (!options || !options.speadsheetId){
            reject("Need valid speadsheetId");
        }
        google.sheets({
            version: "v4",
            auth: new google.auth.JWT(
                process.env[options.emailVariable || "SHEETS_CLIENT_EMAIL"],
                null,
                process.env[options.privateKeyVariable || "SHEETS_PRIVATE_KEY"].replace(/\\n/g, "\n"),
                ["https://www.googleapis.com/auth/spreadsheets.readonly"],
                null
            )
        }).spreadsheets.values.batchGet({
            speadsheetId: options.spreadsheetId,
            ranges,
            majorDimension: "ROWS",
            dateTimeRenderOption: options.dateTimeRenderOption || "FORMATTED_STRING"
        }, function(error, response){
            if (error){reject(error);}
            resolve(response);
        });
    }).then(sheets => sheets.valueRanges)
    .then(rangesToArrays)
    .then(arraysToMaps.bind(null, mappings))
    .catch(console.error);
}

function rangesToArrays(ranges){
    return ranges.map(range => range.values);
}

function arraysToMaps(keys, arrays){
    return arrays.map(array => {
        return arrayToObject(keys, array);
    });
}

function arrayToObject(keys, values){
    if (!keys || !keys.length || !values || !values.length){
        return {};
    }
    const row = {};
    keys.forEach((key, index) => row[key] = values[index]);
    return row;
}

module.exports = {
    getRows,
    arrayToObject,
    rangesToArrays,
    arraysToMaps
};
