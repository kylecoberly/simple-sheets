# Simple Sheets Reader

Reads Google Sheets row data, perfect for sheets populated by Google Forms. This is a wrapper for the very powerful-yet-overwhelming official Sheets API.

Authenticates via JWTs and a [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) by looking for the presence of a `SHEETS_CLIENT_EMAIL` environment variable and a private key environment variable named `SHEETS_PRIVATE_KEY`. See `.env.example` for an example. These will have to be copied from the `.json` file that Google Service Accounts generate.

## API

`simple-sheets-reader` exports an object with a single function, `getRows`, which has the following parameters:

```js
getRows(rows, options).then();
```

It returns a promise that resolves to an object that has arrays with the requested mappings.

`rows` is an array of objects that have the following properties:

```js
[{
    label: "people", // This will be the label of the array
    range: "A2:B", // In A1 format
    mapping: ["firstName", "lastName"] // These are what the columns will be labeled
},{
    label: "locations",
    range: "'Cities'!C2:C",
    mapping: ["city"]
}]
```

`options` include:

* `spreadsheetId` (required): The ID of the Google sheet, which is the long string in the URL of the page
* `emailVariable`: The environment variable containing your authorized email (remember to add permissions for this email to your sheet!)
* `privateKeyVariable`: The environment variable containing your private key for the service account
* `dateTimeFormat`: An optional override of the date format that will return

## Usage

```js
var getRows = require("simple-sheets-reader").getRows;

getRows([
    label: "people",
    range: "A2:B",
    mapping: ["firstName", "lastName"]
},{
    label: "locations",
    range: "'Cities'!C2:C",
    mapping: ["city"]
], {
    spreadsheetId: "9wLECuzvVpx8z7Ux5_9if_wdTDwhxXRcJZpJ-xhVeJRs",
    emailVariable: "SHEETS_CLIENT_EMAIL", // Default value
    privateKeyVariable: "SHEETS_PRIVATE_KEY", // Default value
    dateTimeFormat: "FORMATTED_STRING" // Default value, can be overridden to "SERIAL_NUMBER"
}).then(response => {
    // Do something with the response
}).catch(console.error);
```

## Output

```js
{
    people: [{
        firstName: "Kyle",
        lastName: "Coberly"
    },{
        firstName: "Elyse",
        lastName: "Coberly"
    }],
    cities: [{
        city: "Denver"
    },{
        city: "Seattle"
    }]
}
```

---

## Testing

`npm test`

## API Docs

Look at the [Google Sheets `batchGet` API Docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet) for more information.
