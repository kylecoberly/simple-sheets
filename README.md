# Simple Sheets Reader

Reads Google Sheets row data, perfect for sheets populated by Google Forms. This is a wrapper for the very powerful-yet-overwhelming official Sheets API.

Authenticates via a [Google Service Account](https://cloud.google.com/iam/docs/understanding-service-accounts) by passing in the `client_email` and `private_key` values provided by the `.json` file that Google Service Accounts generate. See [service-account-credentials.json](service-account-credentials.json) for an example.

## API

`simple-sheets-reader` exports an object with a single function, `getRows`, which takes the following arguments:

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

## Usage

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

Look at the [Google Sheets `batchGet` API Docs](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet) for more information.

## Testing

`npm test`

## Upgrading to 2.0

* Credentials need to be passed in, rather than read from the environment
