import crypto from "crypto";

const ALGO = "aes-256-gcm";

function key(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("Missing/invalid ENCRYPTION_KEY (.env.local) - expected 64 hex chars (32 bytes)");
  }
  return Buffer.from(hex, "hex");
}

export function encryptSecret(plaintext: string): { iv: string; tag: string; data: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), data: encrypted.toString("hex") };
}

export function decryptSecret(payload: { iv: string; tag: string; data: string }): string {
  const decipher = crypto.createDecipheriv(ALGO, key(), Buffer.from(payload.iv, "hex"));
  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
