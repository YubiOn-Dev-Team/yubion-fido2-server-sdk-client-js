// Based on standard WebAuthn types, but with ArrayBuffers replaced by Base64URL strings.

/**
 * A variant of the standard `PublicKeyCredentialCreationOptions` where `ArrayBuffer`
 * properties are replaced with Base64URL-encoded strings.
 * This is suitable for transmission over JSON.
 */
export interface PublicKeyCredentialCreationOptionsJSON {
	rp: {
		name: string;
		id?: string;
	};
	user: {
		id: string; // Base64URL
		name: string;
		displayName: string;
	};
	challenge: string; // Base64URL
	pubKeyCredParams: PublicKeyCredentialParameters[];
	timeout?: number;
	excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
	authenticatorSelection?: AuthenticatorSelectionCriteria;
	attestation?: AttestationConveyancePreference;
	extensions?: AuthenticationExtensionsClientInputs;
}

/**
 * A variant of the standard `PublicKeyCredentialDescriptor` where `ArrayBuffer`
 * properties are replaced with Base64URL-encoded strings.
 */
export interface PublicKeyCredentialDescriptorJSON {
	type: "public-key";
	id: string; // Base64URL
	transports?: AuthenticatorTransport[];
}

/**
 * Represents a `PublicKeyCredential` that has been converted into a JSON-serializable
 * object. All `ArrayBuffer` and `TypedArray` instances within the original object
 * are recursively converted to Base64URL-encoded strings.
 */
export type PublicKeyCredentialJSON = any;

/**
 * A variant of the standard `PublicKeyCredentialRequestOptions` where `ArrayBuffer`
 * properties are replaced with Base64URL-encoded strings.
 * This is suitable for transmission over JSON.
 */
export interface PublicKeyCredentialRequestOptionsJSON {
	challenge: string; // Base64URL
	timeout?: number;
	rpId?: string;
	allowCredentials?: PublicKeyCredentialDescriptorJSON[];
	userVerification?: UserVerificationRequirement;
	extensions?: AuthenticationExtensionsClientInputs;
}
