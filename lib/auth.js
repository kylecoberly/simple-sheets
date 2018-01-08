const google = require("googleapis");

function _sheets(clientEmail, privateKey = ""){
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

module.exports = {
    _sheets
};
