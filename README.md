# Simple Sheets

Reads and writes Google Sheets row data, perfect for sheets populated by Google Forms. This is a wrapper for the very-powerful-yet-overwhelming official Sheets API.

Authenticates via a [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) by passing in the `client_email` and `private_key` values provided by the `.json` file that Google Service Accounts generate. See [service-account-credentials.json](service-account-credentials.json) for an example.

## API

### `getRows`

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
* `clientEmail` (required): The authorized `client_email` for your service account (remember to add permissions for this email to your sheet!)
* `privateKey` (required): the authorized `private_key` for your service account
* `dateTimeFormat`: An optional override of the date format that will return

#### Usage

```js
const {getRows} = require("simple-sheets-reader");
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEAoIBAQCwmz3cj...ee+Z81xUH4QTo18s=\n-----END PRIVATE KEY-----\n";

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
    clientEmail: "test-account@fast-ability-145401.iam.gserviceaccount.com",
    privateKey: PRIVATE_KEY,
    dateTimeFormat: "FORMATTED_STRING" // Default value, can be overridden to "SERIAL_NUMBER"
}).then(response => {
    /*
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
    */
}).catch(console.error);
```

### `updateRows`

```js
updateRows(data, options).then();
```

`data` is an array of objects, following the following format:

```js
[{
    range: "A2:A",
    values: [
        ["A"],
        ["B"]
    ]
}]
```

`options` include:

* `spreadsheetId` (required): The ID of the Google sheet, which is the long string in the URL of the page
* `clientEmail` (required): The authorized `client_email` for your service account (remember to add permissions for this email to your sheet!)
* `privateKey` (required): the authorized `private_key` for your service account
* `valueInputOption`: Whether input should be taken literally (`"RAW"`), or as if a user entered them (`"USER_ENTERED"`, default)

It returns a count of modified rows.

#### Usage

```js
const {updateRows} = require("simple-sheets");
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEAoIBAQCwmz3cj...ee+Z81xUH4QTo18s=\n-----END PRIVATE KEY-----\n";

updateRows([{
    range: "A2:A",
    values: [["A"], ["B"]]
},{
    range: "Users!A2:B",
    values: [["C", "D"], ["E", "F"]]
}], {
    spreadsheetId: "9wLECuzvVpx8z7Ux5_9if_wdTDwhxXRcJZpJ-xhVeJRs",
    clientEmail: "test-account@fast-ability-145401.iam.gserviceaccount.com",
    privateKey: PRIVATE_KEY
}).then(response => {
    /*
    {
        updatedRows: 4
    }
    */
}).catch(console.error);
```

### `addRows`

```js
addRows(range, data, options);
```

* `range` is an A1 range (eg "A2:A") that will be searched to find something table-like to append to the end of.
* `data` is an array of arrays of values to add:

```js
[
    ["column 1", "column 2"],
    ["column 1", "column 2"]
]
```

`options` include:

* `spreadsheetId` (required): The ID of the Google sheet, which is the long string in the URL of the page
* `clientEmail` (required): The authorized `client_email` for your service account (remember to add permissions for this email to your sheet!)
* `privateKey` (required): the authorized `private_key` for your service account
* `valueInputOption`: Whether input should be taken literally (`"RAW"`), or as if a user entered them (`"USER_ENTERED"`, default)

It returns an object with the count of modified rows:

#### Usage

```js
const {addRows} = require("simple-sheets");
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEAoIBAQCwmz3cj...ee+Z81xUH4QTo18s=\n-----END PRIVATE KEY-----\n";

addRows("'Form Responses'!A2:B", [
    ["column 1", "column 2"],
    ["column 1", "column 2"]
], {
    spreadsheetId: "9wLECuzvVpx8z7Ux5_9if_wdTDwhxXRcJZpJ-xhVeJRs",
    clientEmail: "test-account@fast-ability-145401.iam.gserviceaccount.com",
    privateKey: PRIVATE_KEY
}).then(response => {
    /*
    {
        updatedRows: 2
    }
    */
}).catch(console.error);
```

---

Look at the [Google Sheets `batchGet` API Docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet), the [Google Sheets `batchUpdate` API Docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet) and the [Google Sheets `append` API Docs](ihttps://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append) for more information.

## Testing

`npm test`
