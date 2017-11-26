const google = require("googleapis");

function getRows(rows, options){
    return new Promise((resolve, reject) => {
        if (!rows || !rows.length){
            reject("Need valid rows");
        }
        if (!options || !options.spreadsheetId){
            reject("Need valid spreadsheetId");
        }
        _sheets(options.clientEmail, options.privateKey).batchGet({
            spreadsheetId: options.spreadsheetId,
            ranges: _getRanges(rows),
            majorDimension: "ROWS",
            dateTimeRenderOption: options.dateTimeRenderOption || "FORMATTED_STRING"
        }, (error, response) => {
            if (error){reject(error);}
            resolve(response);
        });
    }).then(_sheetsToMappedObject.bind(null, rows))
    .catch(console.error);
}

function _sheets(clientEmail, privateKey){
    return google.sheets({
        version: "v4",
        auth: new google.auth.JWT(
            clientEmail,
            null,
            privateKey,
            ["https://www.googleapis.com/auth/spreadsheets"],
            null
        )
    }).spreadsheets.values;
}

function _getRanges(rows){
    return rows.map(row => {
        if (!row.range){
            throw new Error("Need valid A1 ranges");
        } else {
            return row.range
        }
    });
}

function _sheetsToMappedObject(rows, sheets){
    return rows.reduce((accumulator, row, index) => {
        if (!row.mapping || !row.mapping.length){
            throw new Error("Need valid mapping");
        }
        if (!row.label){
            throw new Error("Need valid label");
        }
        accumulator[row.label] = _rowsToMaps(row.mapping, sheets.valueRanges[index].values);
        return accumulator;
    }, {});
}

function _rowsToMaps(keys, rows){
    return rows.map(_rowToMap.bind(null, keys));
}

function _rowToMap(keys, values){
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
    _sheets,
    _rowsToMaps,
    _rowToMap,
    _sheetsToMappedObject,
    _getRanges
};
