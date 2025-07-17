# yubion-fido2-server-sdk-client-js

[English](README.md) | [Japanese](README.ja.md)

## yubion-fido2-server-sdk-client-jsとは
このプロジェクトは、YubiOn FIDO2サーバーサービスを利用するためのクライアントサイドSDKです。各言語向けのサーバー用SDKと組み合わせて使用します。API呼び出しで使われるJSON形式と、ブラウザのWebAuthn APIで要求される`ArrayBuffer`形式との間で、データを相互に変換するためのヘルパー関数を提供します。

**注意:** このライブラリはブラウザ環境でのみ使用することを想定しています。

## インストール

```bash
npm install @yubion-dev-team/yubion-fido2-server-sdk-client-js
```

## 使い方 (モジュールバンドラ利用時)

このSDKは、FIDO2/WebAuthnの登録および認証処理におけるデータ変換を扱うための、主要な3つの関数をエクスポートします。

### 1. 登録処理 (Attestation)

サーバーからJSON形式の`PublicKeyCredentialCreationOptions`を受け取ったら、`navigator.credentials.create()`に渡す前に`convertCreationOptionsToBinary`を使用します。

```javascript
import { convertCreationOptionsToBinary, convertPublicKeyCredentialToJsonable } from '@yubion-dev-team/yubion-fido2-server-sdk-client-js';

async function register() {
  // 1. サーバーから登録オプションを取得します
  const creationOptionsJSON = await fetch('/api/fido2/attestation/options', { method: 'POST' }).then(r => r.json());

  // 2. オプションをWebAuthn APIが必要とする形式に変換します
  const creationOptions = convertCreationOptionsToBinary(creationOptionsJSON);

  // 3. 新しいクレデンシャルを作成します
  const credential = await navigator.credentials.create({ publicKey: creationOptions });

  // 4. サーバーに送信する前に、クレデンシャルをJSONで扱える形式に変換します
  const credentialJSON = convertPublicKeyCredentialToJsonable(credential);

  // 5. JSON形式のクレデンシャルをサーバーに送信し、検証を依頼します
  await fetch('/api/fido2/attestation/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialJSON),
  });
}
```

### 2. 認証処理 (Assertion)

同様に、認証処理の際も、サーバーから受け取ったオプションに対して`convertRequestOptionsToBinary`を使用します。

```javascript
import { convertRequestOptionsToBinary, convertPublicKeyCredentialToJsonable } from '@yubion-dev-team/yubion-fido2-server-sdk-client-js';

async function login() {
  // 1. サーバーから認証オプションを取得します
  const requestOptionsJSON = await fetch('/api/fido2/assertion/options', { method: 'POST' }).then(r => r.json());

  // 2. オプションをWebAuthn APIが必要とする形式に変換します
  const requestOptions = convertRequestOptionsToBinary(requestOptionsJSON);

  // 3. アサーションを取得します
  const assertion = await navigator.credentials.get({ publicKey: requestOptions });

  // 4. アサーションをJSONで扱える形式に変換します
  const assertionJSON = convertPublicKeyCredentialToJsonable(assertion);

  // 5. JSON形式のアサーションをサーバーに送信し、検証を依頼します
  await fetch('/api/fido2/assertion/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assertionJSON),
  });
}
```

## 使い方 (従来の方法)

モジュールバンドラを使わない環境では、UMDバンドルを利用できます。

### 1. スクリプトの読み込み

CDNまたは自身のサーバーからスクリプトファイルを読み込みます。これにより、グローバル変数 `yubionFido2Client` が利用可能になります。

```html
<!-- CDNから読み込む場合 (例: jsDelivr) -->
<script src="https://cdn.jsdelivr.net/npm/@yubion-dev-team/yubion-fido2-server-sdk-client-js/dist/umd/yubion-fido2-server-sdk-client.min.js"></script>

<!-- または unpkg -->
<script src="https://unpkg.com/@yubion-dev-team/yubion-fido2-server-sdk-client-js/dist/umd/yubion-fido2-server-sdk-client.min.js"></script>

<!-- 次に、あなたのアプリケーション用スクリプトを読み込みます -->
<script src="/path/to/your/app.js"></script>
```

### 2. 関数の呼び出し

`app.js` の中で、グローバルオブジェクトから関数を呼び出すことができます。

```javascript
// app.js
var convertCreationOptionsToBinary = yubionFido2Client.convertCreationOptionsToBinary;
var convertPublicKeyCredentialToJsonable = yubionFido2Client.convertPublicKeyCredentialToJsonable;
var convertRequestOptionsToBinary = yubionFido2Client.convertRequestOptionsToBinary;

async function register() {
  // 1. サーバーから登録オプションを取得
  var creationOptionsJSON = await fetch('/api/fido2/attestation/options', { method: 'POST' }).then(function(r) { return r.json(); });

  // 2. オプションを変換
  var creationOptions = convertCreationOptionsToBinary(creationOptionsJSON);

  // 3. クレデンシャルを作成
  var credential = await navigator.credentials.create({ publicKey: creationOptions });

  // 4. クレデンシャルをJSON化
  var credentialJSON = convertPublicKeyCredentialToJsonable(credential);

  // 5. サーバーに送信
  await fetch('/api/fido2/attestation/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentialJSON),
  });
}
```

## APIリファレンス

- `convertCreationOptionsToBinary(creationOptionsJson)`
- `convertPublicKeyCredentialToJsonable(pubKeyCred)`
- `convertRequestOptionsToBinary(requestOptionsJson)`

## ライセンス

[MIT](LICENSE)
