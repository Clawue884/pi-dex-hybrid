import crypto from "crypto";

const ALGO = "aes-256-gcm";

export function encryptMessage(message: string, key: Buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(message, "utf8"),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return { encrypted, iv, tag };
}

export function decryptMessage(
  encrypted: Buffer,
  iv: Buffer,
  tag: Buffer,
  key: Buffer
) {
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}
