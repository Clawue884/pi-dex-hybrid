import crypto from "crypto";

export class EncryptedMempool {
  private pool: any[] = [];
  private key: Buffer;

  constructor(secret: string) {
    this.key = crypto.createHash("sha256").update(secret).digest();
  }

  encrypt(intent: any) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(intent)),
      cipher.final()
    ]);
    return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
  }

  decrypt(payload: any) {
    const iv = Buffer.from(payload.iv, "hex");
    const encrypted = Buffer.from(payload.data, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", this.key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    return JSON.parse(decrypted.toString());
  }

  push(intent: any) {
    const encrypted = this.encrypt(intent);
    this.pool.push(encrypted);
  }

  popAllDecrypted() {
    return this.pool.splice(0).map(e => this.decrypt(e));
  }
}
