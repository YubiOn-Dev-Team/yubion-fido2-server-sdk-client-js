import {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialJSON,
	PublicKeyCredentialRequestOptionsJSON
} from "./types";

/**
 * Converts a JSON-friendly `PublicKeyCredentialCreationOptions` object into the
 * format expected by the `navigator.credentials.create()` method by decoding
 * Base64URL strings into `ArrayBuffer`s.
 * @param creationOptionsJson The JSON-friendly creation options.
 * @returns The binary-compatible creation options.
 */
export function convertCreationOptionsToBinary(creationOptionsJson : PublicKeyCredentialCreationOptionsJSON) : PublicKeyCredentialCreationOptions {
	return {
		challenge : base64UrlDecode(creationOptionsJson.challenge),
		pubKeyCredParams : creationOptionsJson.pubKeyCredParams,
		rp : {
			id : creationOptionsJson.rp.id,
			name : creationOptionsJson.rp.name,
		},
		user : {
			id : base64UrlDecode(creationOptionsJson.user.id),
			name : creationOptionsJson.user.name,
			displayName : creationOptionsJson.user.displayName,
		},
		attestation : creationOptionsJson.attestation as AttestationConveyancePreference,
		authenticatorSelection : creationOptionsJson.authenticatorSelection,
		excludeCredentials : creationOptionsJson.excludeCredentials?.map((x) => ({
			id : base64UrlDecode(x.id),
			type : x.type as "public-key",
			transports : x.transports as AuthenticatorTransport[],
		})),
		extensions : creationOptionsJson.extensions,
		timeout : creationOptionsJson.timeout,
	};
}

/**
 * Converts a `PublicKeyCredential` object returned by the WebAuthn API into a
 * JSON-serializable object by recursively encoding all `ArrayBuffer` and `TypedArray`
 * instances into Base64URL strings.
 * @param pubKeyCred The `PublicKeyCredential` object.
 * @returns A JSON-serializable representation of the credential.
 */
export function convertPublicKeyCredentialToJsonable(pubKeyCred : PublicKeyCredential) : PublicKeyCredentialJSON {
	return arrayBufToBase64url(pubKeyCred);
}

/**
 * Converts a JSON-friendly `PublicKeyCredentialRequestOptions` object into the
 * format expected by the `navigator.credentials.get()` method by decoding
 * Base64URL strings into `ArrayBuffer`s.
 * @param requestOptionsJson The JSON-friendly request options.
 * @returns The binary-compatible request options.
 */
export function convertRequestOptionsToBinary(requestOptionsJson : PublicKeyCredentialRequestOptionsJSON) : PublicKeyCredentialRequestOptions {
	return {
		challenge : base64UrlDecode(requestOptionsJson.challenge),
		allowCredentials : requestOptionsJson.allowCredentials ? requestOptionsJson.allowCredentials.map((x) => ({
			id : base64UrlDecode(x.id),
			type : x.type as "public-key",
			transports : x.transports as AuthenticatorTransport[],
		})) : undefined,
		rpId : requestOptionsJson.rpId,
		timeout : requestOptionsJson.timeout,
		userVerification : requestOptionsJson.userVerification as UserVerificationRequirement | undefined,
		extensions : requestOptionsJson.extensions,
	};
}

/**
 * Recursively finds and converts all ArrayBuffer and Uint8Array instances in an object
 * to Base64URL-encoded strings.
 * @param data The object to process.
 * @returns A new object with binary data encoded.
 */
const arrayBufToBase64url = function(data : any) : any {
	if (data instanceof Array) {
		let ary = [];
		for (let i of data){
			ary.push(arrayBufToBase64url(i));
		}
		return ary;
	}

	if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
		return base64UrlEncode(data);
	}

	if (data instanceof Object) {
		let obj : { [key : string] : any }= {};

		for (let key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				obj[key] = arrayBufToBase64url(data[key]);
			}
		}
		return obj;
	}
	return data;
}

/**
 * Decodes a Base64URL-encoded string into an ArrayBuffer.
 * @param encodedData The Base64URL string.
 * @returns The decoded ArrayBuffer.
 */
function base64UrlDecode(encodedData : string) : ArrayBuffer {
	const standardBase64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
	const binaryString = atob(standardBase64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}

/**
 * Encodes an ArrayBuffer into a Base64URL string.
 * @param data The ArrayBuffer to encode.
 * @returns The Base64URL-encoded string.
 */
function base64UrlEncode(data : ArrayBuffer) : string {
	const bytes = new Uint8Array(data);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}
