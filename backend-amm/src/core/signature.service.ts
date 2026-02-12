import nacl from "tweetnacl";
import { createHash } from "crypto";

export interface SignedOrder {
  publicKey: string;   // base64
  signature: string;   // base64
  payload: string;     // JSON string
}

export class SignatureService {

  static hashPayload(payload: string): Uint8Array {
    const hash = createHash("sha256").update(payload).digest();
    return new Uint8Array(hash);
  }

  static verifySignature(order: SignedOrder): boolean {
    try {
      const publicKey = Buffer.from(order.publicKey, "base64");
      const signature = Buffer.from(order.signature, "base64");
      const messageHash = this.hashPayload(order.payload);

      return nacl.sign.detached.verify(
        messageHash,
        signature,
        publicKey
      );
    } catch (e) {
      return false;
    }
  }
}
