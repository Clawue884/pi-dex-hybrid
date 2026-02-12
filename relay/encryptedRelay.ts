// relay/encryptedRelay.ts
import crypto from 'crypto'

export function encryptIntent(intent: any, sharedKey: Buffer) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', sharedKey, iv)
  const enc = Buffer.concat([cipher.update(JSON.stringify(intent)), cipher.final()])
  return { iv, data: enc, tag: cipher.getAuthTag() }
}

export function decryptIntent(payload, sharedKey: Buffer) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', sharedKey, payload.iv)
  decipher.setAuthTag(payload.tag)
  const dec = Buffer.concat([decipher.update(payload.data), decipher.final()])
  return JSON.parse(dec.toString())
}
