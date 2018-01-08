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
        accumulator[row.label] = _rowsToMaps(row.mapping, sheets.valueRanges[index].values || []);
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
    _rowsToMaps,
    _rowToMap,
    _sheetsToMappedObject,
    _getRanges
};
