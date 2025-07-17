# yubion-fido2-server-sdk-client-js

[English](README.md) | [Japanese](README.ja.md)

## What is yubion-fido2-server-sdk-client-js?
This project is a client-side SDK to support WebAuthn API calls for YubiOn FIDO2 Server Service. It is used in combination with server SDKs for each programming language. It provides helper functions to convert data between the JSON format used in API calls and the `ArrayBuffer` format expected by the browser's WebAuthn API.

**Note:** This library is intended for use in browser environments only.

## Installation

```bash
npm install @yubion-dev-team/yubion-fido2-server-sdk-client-js
```

## Usage (with module bundler)

This SDK exports three main functions to handle data conversion for FIDO2/WebAuthn registration and authentication ceremonies.

### 1. Registration (Attestation)

When you receive the `PublicKeyCredentialCreationOptions` from your server (which should be in a JSON-compatible format), use `convertCreationOptionsToBinary` before passing it to `navigator.credentials.create()`.

```javascript
import { convertCreationOptionsToBinary, convertPublicKeyCredentialToJsonable } from '@yubion-dev-team/yubion-fido2-server-sdk-client-js';

async function register() {
  // 1. Fetch creation options from your server
  const creationOptionsJSON = await fetch('/api/fido2/attestation/options', { method: 'POST' }).then(r => r.json());

  // 2. Convert the options to the format required by the WebAuthn API
  const creationOptions = convertCreationOptionsToBinary(creationOptionsJSON);

  // 3. Create the new credential
  const credential = await navigator.credentials.create({ publicKey: creationOptions });

  // 4. Convert the credential to a JSON-friendly format before sending it back to your server
  const credentialJSON = convertPublicKeyCredentialToJsonable(credential);

  // 5. Send the JSON-friendly credential to your server for verification
  await fetch('/api/fido2/attestation/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialJSON),
  });
}
```

### 2. Authentication (Assertion)

Similarly, when authenticating, use `convertRequestOptionsToBinary` for the options received from the server.

```javascript
import { convertRequestOptionsToBinary, convertPublicKeyCredentialToJsonable } from '@yubion-dev-team/yubion-fido2-server-sdk-client-js';

async function login() {
  // 1. Fetch request options from your server
  const requestOptionsJSON = await fetch('/api/fido2/assertion/options', { method: 'POST' }).then(r => r.json());

  // 2. Convert the options to the format required by the WebAuthn API
  const requestOptions = convertRequestOptionsToBinary(requestOptionsJSON);

  // 3. Get the assertion
  const assertion = await navigator.credentials.get({ publicKey: requestOptions });

  // 4. Convert the assertion to a JSON-friendly format
  const assertionJSON = convertPublicKeyCredentialToJsonable(assertion);

  // 5. Send the JSON-friendly assertion to your server for verification
  await fetch('/api/fido2/assertion/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assertionJSON),
  });
}
```

## Usage (in classic Javascript)

For environments without a module bundler, you can use the UMD bundle.

### 1. Load the script

Include the script file from a CDN or your own server. This will expose the functions on the global `yubionFido2Client` object.

```html
<!-- From a CDN (e.g., jsDelivr) -->
<script src="https://cdn.jsdelivr.net/npm/@yubion-dev-team/yubion-fido2-server-sdk-client-js/dist/umd/yubion-fido2-server-sdk-client.min.js"></script>

<!-- Or from unpkg -->
<script src="https://unpkg.com/@yubion-dev-team/yubion-fido2-server-sdk-client-js/dist/umd/yubion-fido2-server-sdk-client.min.js"></script>

<!-- Then include your application script -->
<script src="/path/to/your/app.js"></script>
```

### 2. Call the functions

In your `app.js`, you can access the functions from the global object.

```javascript
// app.js
const {
  convertCreationOptionsToBinary,
  convertPublicKeyCredentialToJsonable,
  convertRequestOptionsToBinary
} = yubionFido2Client;

async function register() {
  // 1. Fetch creation options from your server
  const creationOptionsJSON = await fetch('/api/fido2/attestation/options', { method: 'POST' }).then(r => r.json());

  // 2. Convert the options
  const creationOptions = convertCreationOptionsToBinary(creationOptionsJSON);

  // 3. Create the new credential
  const credential = await navigator.credentials.create({ publicKey: creationOptions });

  // 4. Convert the credential to JSON
  const credentialJSON = convertPublicKeyCredentialToJsonable(credential);

  // 5. Send to your server
  await fetch('/api/fido2/attestation/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialJSON),
  });
}
```

## API Reference
- `convertCreationOptionsToBinary(creationOptionsJson)`
- `convertPublicKeyCredentialToJsonable(pubKeyCred)`
- `convertRequestOptionsToBinary(requestOptionsJson)`

## License

[MIT](LICENSE)
