const {
    _sheets
} = require("./auth");
const {
    _rowToMap,
    _sheetsToMappedObject,
    _getRanges
} = require("./utilities");

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

module.exports = {
    getRows,
    updateRows,
    addRows
};
