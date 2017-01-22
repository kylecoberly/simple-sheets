# Simple Sheets Reader

Reads Google Sheets data, particularly the kind populated by Google Forms.

Authenticates via JWTs and a Google Service Account by looking for the presence of a `SHEETS_CLIENT_EMAIL` environment variable and a private key environment variable named `SHEETS_PRIVATE_KEY`. See `.env.example` for an example. These will have to be copied from the `.json` file that Google Service Accounts generate.

## Usage

```js
var getSurveyData = require("simple-sheets-reader");

getSurveyData("9wLECuzvVpx8z7Ux5_9if_wdTDwhxXRcJZpJ-xhVeJRs", ["A2:A", "C2:C"]).then(function(response){
    console.log(response);
}).catch(console.error);
```

Take an optional third argument that allows you to override `majorDimension` and `dateTimeRenderOption`.

```js
{
    majorDimension: "ROWS", // Defaults to "COLUMNS",
    dateTimeRenderOption: "SERIAL_NUMBER" // Defaults to "FORMATTED_STRING"
}
```

## Output

```js
{
    spreadsheetId: '11LECozvVpx5A7Ux5_8Zf_wdTD1hfXRclZpJ-xhVeJRs',
    valueRanges: [{
        range: '\'Form Responses 1\'!A2:A1227',
        majorDimension: 'COLUMNS',
        values: [
            // Values Go Here
        ]
    },{
        range: '\'Form Responses 1\'!C2:C1227',
        majorDimension: 'COLUMNS',
        values: [
            // Values Go Here
        ]}
    ] 
}
```

Look at the [Google Sheets `batchGet` API Docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet) for more information.
