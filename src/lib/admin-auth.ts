function base64url(payload: string | Uint8Array): string {
  let base64: string;

  if (typeof payload === "string") {
    // Encode string to Base64
    base64 = btoa(payload);
  } else {
    // Encode Uint8Array/Buffer to Base64
    base64 = btoa(String.fromCharCode(...payload));
  }
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): string {
  // Reverse the URL-safe replacements
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add back padding
  const remainder = base64.length % 4;
  if (remainder === 2) base64 += "==";
  else if (remainder === 3) base64 += "=";

  // Decode from base64 to original string
  return atob(base64);
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  hex = hex.replace(/[^0-9a-fA-F]/g, "");

  if (hex.length % 2 !== 0) {
    throw new Error("HEX string not valid");
  }

  const byteArray = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
    byteArray[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }

  return byteArray;
}

export async function signSession(secret: string) {
  /// CREATE THE PAYLOAD
  //create a new expiring time in 8 hours
  const nowMillisecond = Date.now() / 1000;

  //8 hours to expire
  const millisecondExpire = 8 * 60 * 60;

  //Total expire time
  const expireTimeMillisecond = millisecondExpire + nowMillisecond;

  //convert back to seconds:
  const exp = Math.floor(expireTimeMillisecond);

  //   console.log("TEST NEW EXPIRE: ", exp);
  const payload = JSON.stringify({ exp });
  const encodedPayload = base64url(payload);

  // 2. Prepare the secret for the crypto use
  const secretBytes = hexToBytes(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw", // Format
    secretBytes, // Uint8Array of bytes
    { name: "HMAC", hash: "SHA-256" }, // Algorithm
    false, // Not extractable
    ["sign", "verify"], // Usages
  );

  // 3. Sign it
  const encoder = new TextEncoder();
  const dataToSign = encoder.encode(encodedPayload);

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    dataToSign,
  );

  const signature = base64url(new Uint8Array(signatureBytes));

  return `${encodedPayload}.${signature}`;
}

export async function verifySession(token: string, secret: string | undefined) {
  if (typeof secret === "undefined") {
    return false;
  }

  //Basic validation
  if (token === "" || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const encodedPayload = parts[0];
  const claimedSignature = parts[1];

  // Prepare the secret for crypto use
  const secretBytes = hexToBytes(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw", // Format
    secretBytes, // Uint8Array of bytes
    { name: "HMAC", hash: "SHA-256" }, // Algorithm
    false, // Not extractable
    ["sign", "verify"], // Usages
  );

  //Sign the encodedpayload again to receive a signature
  const encoder = new TextEncoder();
  const dataToSign = encoder.encode(encodedPayload);

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    dataToSign,
  );

  const expectedSignature = base64url(new Uint8Array(signatureBytes));

  //Proceed to check the two
  if (claimedSignature.length != expectedSignature.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < expectedSignature.length; i++) {
    mismatch =
      mismatch |
      (claimedSignature.charCodeAt(i) ^ expectedSignature.charCodeAt(i));
  }

  if (mismatch != 0) {
    return false;
  }

  //Decode and check for expiration
  const jsonString = base64urlDecode(encodedPayload);

  const payload = JSON.parse(jsonString);

  const currentTime = Math.floor(Date.now() / 1000);

  if (payload.exp < currentTime) {
    return false;
  }

  return true;
}
