const google = require("googleapis");

function getRows(rows, options){
    return new Promise((resolve, reject) => {
        if (!rows || !rows.length){reject("Need valid rows")}
        if (!options){reject("Need valid options")}
        if (!options.spreadsheetId || typeof options.privateKey !== "string"){reject("Need valid spreadsheetId")}
        if (!options.clientEmail || typeof options.privateKey !== "string"){reject("Need valid clientEmail")}
        if (!options.privateKey || typeof options.privateKey !== "string"){reject("Need valid privateKey")}

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

function updateRows(data, options){
    return new Promise((resolve, reject) => {
        if (!data || !data.length){reject("Need data")}
        if (!options){reject("Need valid options")}
        if (!options.spreadsheetId || typeof options.privateKey !== "string"){reject("Need valid spreadsheetId")}
        if (!options.clientEmail || typeof options.privateKey !== "string"){reject("Need valid clientEmail")}
        if (!options.privateKey || typeof options.privateKey !== "string"){reject("Need valid privateKey")}

        _sheets(options.clientEmail, options.privateKey).batchUpdate({
            spreadsheetId: options.spreadsheetId,
            resource: {
                valueInputOption: options.valueInputOption || "USER_ENTERED",
                data
            }
        }, (error, response) => {
            if (error){reject(error);}
            resolve(response);
        });
    }).then(response => ({updatedRows: response.totalUpdatedRows}))
    .catch(console.error);
}

function addRows(range, data, options){
    return new Promise((resolve, reject) => {
        if (!range){reject("Need range")}
        if (!data || !data.length){reject("Need data")}
        if (!options){reject("Need valid options")}
        if (!options.spreadsheetId || typeof options.privateKey !== "string"){reject("Need valid spreadsheetId")}
        if (!options.clientEmail || typeof options.privateKey !== "string"){reject("Need valid clientEmail")}
        if (!options.privateKey || typeof options.privateKey !== "string"){reject("Need valid privateKey")}

        _sheets(options.clientEmail, options.privateKey).append({
            spreadsheetId: options.spreadsheetId,
            range,
            valueInputOption: options.valueInputOption || "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: data
            }
        }, (error, response) => {
            if (error){reject(error)}
            resolve(response);
        });
    }).then(response => ({updatedRows: response.updates.updatedRows}))
    .catch(console.error);
}

function _sheets(clientEmail, privateKey){
    return google.sheets({
        version: "v4",
        auth: new google.auth.JWT(
            clientEmail,
            null,
            privateKey.replace(/\\n/g, "\n"),
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
    updateRows,
    addRows,
    _sheets,
    _rowsToMaps,
    _rowToMap,
    _sheetsToMappedObject,
    _getRanges
};
