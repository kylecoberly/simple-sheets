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

function getRows(rows, options){
    return new Promise(function(resolve, reject){
        if (!rows || !rows.length){
            reject("Need valid rows");
        }
        if (!rows.mapping || !rows.mapping.length){
            reject("Need valid mappings");
        }
        if (!rows.ranges || !rows.ranges.length){
            reject("Need valid A1 ranges");
        }
        if (!rows.description){
            reject("Need valid description");
        }
        if (!options || !options.spreadsheetId){
            reject("Need valid spreadsheetId");
        }
        getSheets(options.emailVariable, options.privateKeyVariable)({
            spreadsheetId: options.spreadsheetId,
            ranges: getRanges(rows),
            majorDimension: "ROWS",
            dateTimeRenderOption: options.dateTimeRenderOption || "FORMATTED_STRING"
        }, function(error, response){
            if (error){reject(error);}
            resolve(response);
        });
    }).then(sheetsToMappedObject.bind(null, rows))
    .catch(console.error);
}

function getRanges(rows){
    return rows.map(row => row.range);
}

function sheetsToMappedObject(rows, sheets){
    return rows.reduce((accumulator, row, index) => {
        accumulator[row.label] = rowsToMaps(row.mapping, sheets.valueRanges[index].values);
        return accumulator;
    }, {});
}

function rowsToMaps(keys, rows){
    return rows.map(rowToMap.bind(null, keys));
}

function rowToMap(keys, values){
    if (!keys || !keys.length || !values || !values.length){
        return {};
    }
    return keys.reduce((accumulator, key, index) => {
        accumulator[key] = values[index];
        return accumulator;
    }, {});
}

module.exports = {
    getRows,
    rowsToMaps,
    rowToMap,
    sheetsToMappedObject,
    getRanges
};
