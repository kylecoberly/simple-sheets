const google = require("googleapis");

function getSheets(emailVariable, privateKeyVariable){
    return google.sheets({
        version: "v4",
        auth: new google.auth.JWT(
            process.env[emailVariable || "SHEETS_CLIENT_EMAIL"],
            null,
            process.env[privateKeyVariable || "SHEETS_PRIVATE_KEY"].replace(/\\n/g, "\n"),
            ["https://www.googleapis.com/auth/spreadsheets.readonly"],
            null
        )
    }).spreadsheets.values.batchGet;
}

function getRows(ranges, mappings, options){
    return new Promise(function(resolve, reject){
        if (!ranges || !ranges.length){
            reject("Need valid ranges");
        }
        if (!mappings || !mappings.length){
            reject("Need valid mappings");
        }
        if (!options || !options.spreadsheetId){
            reject("Need valid spreadsheetId");
        }
        getSheets(options.emailVariable, options.privateKeyVariable)({
            spreadsheetId: options.spreadsheetId,
            ranges,
            majorDimension: "ROWS",
            dateTimeRenderOption: options.dateTimeRenderOption || "FORMATTED_STRING"
        }, function(error, response){
            if (error){reject(error);}
            resolve(response);
        });
    }).then(sheetsToMappedObject.bind(null, mappings))
    .catch(console.error);
}

function sheetsToMappedObject(mappings, sheet){
    return arraysToMaps(mappings, getValueRanges(sheet));
}

function getValueRanges(sheet){
    return sheet.valueRanges.map(valueRange => valueRange.values);
}

function arraysToMaps(keys, rangeArrays){
    return rangeArrays.map((rangeRows, index) => {
        return arrayToMap(keys[index], rangeRows);
    });
}

function arrayToMap(keys, arrays){
    return arrays.map(arrayToObject.bind(null, keys));
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
    arraysToMaps,
    arrayToMap,
    sheetsToMappedObject,
    getValueRanges
};
