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
        if (!rows || !rows.length){return reject(new Error("Need valid rows"))}
        if (!options){return reject(new Error("Need valid options"))}
        if (!options.spreadsheetId || typeof options.privateKey !== "string"){return reject(new Error("Need valid spreadsheetId"))}
        if (!options.clientEmail || typeof options.privateKey !== "string"){return reject(new Error("Need valid clientEmail"))}
        if (!options.privateKey || typeof options.privateKey !== "string"){return reject(new Error("Need valid privateKey"))}

        _sheets(options.clientEmail, options.privateKey).batchGet({
            spreadsheetId: options.spreadsheetId,
            ranges: _getRanges(rows),
            majorDimension: "ROWS",
            dateTimeRenderOption: options.dateTimeRenderOption || "FORMATTED_STRING"
        }, (error, response) => {
            if (error){return reject(error);}
            resolve(response);
        });
    }).then(_sheetsToMappedObject.bind(null, rows));
}

function updateRows(data, options){
    return new Promise((resolve, reject) => {
        if (!data || !data.length){return reject(new Error("Need data"))}
        if (!options){return reject(new Error("Need valid options"))}
        if (!options.spreadsheetId || typeof options.privateKey !== "string"){return reject(new Error("Need valid spreadsheetId"))}
        if (!options.clientEmail || typeof options.privateKey !== "string"){return reject(new Error("Need valid clientEmail"))}
        if (!options.privateKey || typeof options.privateKey !== "string"){return reject(new Error("Need valid privateKey"))}

        _sheets(options.clientEmail, options.privateKey).batchUpdate({
            spreadsheetId: options.spreadsheetId,
            resource: {
                valueInputOption: options.valueInputOption || "USER_ENTERED",
                data
            }
        }, (error, response) => {
            if (error){return reject(error);}
            resolve(response);
        });
    }).then(response => ({updatedRows: response.totalUpdatedRows}));
}

function addRows(range, data, options){
    return new Promise((resolve, reject) => {
        if (!range){return reject(new Error("Need range"))}
        if (!data || !data.length){return reject(new Error("Need data"))}
        if (!options){return reject(new Error("Need valid options"))}
        if (!options.spreadsheetId || typeof options.privateKey !== "string"){return reject(new Error("Need valid spreadsheetId"))}
        if (!options.clientEmail || typeof options.privateKey !== "string"){return reject(new Error("Need valid clientEmail"))}
        if (!options.privateKey || typeof options.privateKey !== "string"){return reject(new Error("Need valid privateKey"))}

        _sheets(options.clientEmail, options.privateKey).append({
            spreadsheetId: options.spreadsheetId,
            range,
            valueInputOption: options.valueInputOption || "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: data
            }
        }, (error, response) => {
            if (error){return reject(error)}
            resolve(response);
        });
    }).then(response => ({updatedRows: response.updates.updatedRows}));    
}

module.exports = {
    getRows,
    updateRows,
    addRows
};
