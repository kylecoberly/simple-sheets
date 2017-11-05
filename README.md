# Simple Sheets Reader

Reads Google Sheets row data, perfect for sheets populated by Google Forms.

Authenticates via JWTs and a [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) by looking for the presence of a `SHEETS_CLIENT_EMAIL` environment variable and a private key environment variable named `SHEETS_PRIVATE_KEY`. See `.env.example` for an example. These will have to be copied from the `.json` file that Google Service Accounts generate.

## API

`simple-sheets-reader` exports an object with a single function, `getRows`, which has the following parameters:

```js
getRows(ranges, mappings, options).then();
```

It returns a promise that resolves to an array of objects that have the requested mappings.

* `ranges` is an array of valid A1 ranges (eg. `[[A2:A], ['Project Submissions'!B2:C]]`)
* `mappings` is an array of mappings for each range (eg. `[["columnA"],["columnB", "columnC"]]`)
* Options include:
    * `spreadsheetId` (required): The ID of the Google sheet, which is the long string in the URL of the page
    * `emailVariable`: The environment variable containing your authorized email (remember to add permissions for this email to your sheet!)
    * `privateKeyVariable`: The environment variable containing your private key for the service account
    * `dateTimeFormat`: An optional override of the date format that will return

## Usage

```js
var getRows = require("simple-sheets-reader").getRows;

getRows({
    spreadsheetId: "9wLECuzvVpx8z7Ux5_9if_wdTDwhxXRcJZpJ-xhVeJRs",
    emailVariable: "SHEETS_CLIENT_EMAIL", // Default value
    privateKeyVariable: "SHEETS_PRIVATE_KEY", // Default value
    dateTimeFormat: "FORMATTED_STRING" // Default value, can be overridden to "SERIAL_NUMBER"
},["A2:A", "C2:C"], [["firstColumn"], ["secondColumn"]])
.then(response => {
    // Do something with the response
}).catch(console.error);
```

## Output

```js
[
    [{
        firstColumn: "First Row"
    },{
        firstColumn: "Second Row"
    }],
    [{
        secondColumn: "First Row"
    }]
]
```

---

## Testing

`npm test`

## API Docs

Look at the [Google Sheets `batchGet` API Docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet) for more information.
