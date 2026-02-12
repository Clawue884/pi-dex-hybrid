import crypto from "crypto";

export function verifySignature(
  message: string,
  signature: string,
  publicKey: string
): boolean {
  const verify = crypto.createVerify("SHA256");
  verify.update(message);
  verify.end();
  return verify.verify(publicKey, signature, "hex");
}
