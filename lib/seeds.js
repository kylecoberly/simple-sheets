const {updateRows} = require("./read-write");

function getBlankValues(){
    const array = [];
    for (let i = 1; i < 1000; i++){
        // Heap overflows if you try to be more clever about this
        array.push([
            "","","","","",
            "","","","","",
            "","","","","",
            "","","","","",
            "","","","","",
            ""
        ]);
    }
    return array;
}

function clearSheet(sheetName, options = {}){
    return updateRows([{
        range: `'${sheetName}'!A2:ZZ1000`,
        values: getBlankValues()
    }], options);
}

function clearSheets(sheets, options){
    return Promise.all(sheets.map(sheet => clearSheet(sheet, options)));
}

function seedSheet(sheetName, mapping, seedData, options = {}){
    return updateRows([{
        range: `'${sheetName}'!A2:ZZ1000`,
        values: seedData.map(row => {
            return mapping.map(item => row[item] || "");
        })
    }], options);
}

function seedSheets(sheets, options){
    return Promise.all(sheets.map(sheet => seedSheet(
        sheet.sheetName,
        sheet.mapping,
        sheet.seedData,
        options
    )));
}

module.exports = {
    clearSheet,
    seedSheet,
    clearSheets,
    seedSheets
};
