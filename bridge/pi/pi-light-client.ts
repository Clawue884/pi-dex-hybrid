// bridge/pi/pi-light-client.ts
import crypto from "crypto";

export interface PiHeader {
  parent: string;
  txRoot: string;
  stateRoot: string;
  height: number;
  timestamp: number;
}

export class PiLightClient {
  headers = new Map<string, PiHeader>();
  canonical = new Map<number, string>();
  latestHeight = 0;
  FINALITY_DELAY = 20;

  submitHeader(hash: string, h: PiHeader) {
    if (h.height > 0) {
      const parent = this.canonical.get(h.height - 1);
      if (parent !== h.parent) throw new Error("bad parent");
    }
    this.headers.set(hash, h);
    this.canonical.set(h.height, hash);
    this.latestHeight = Math.max(this.latestHeight, h.height);
  }

  isFinal(height: number) {
    return this.latestHeight > height + this.FINALITY_DELAY;
  }

  verifyTxInclusion(txHash: string, proof: string[], index: number, root: string) {
    let h = txHash;
    for (let i = 0; i < proof.length; i++) {
      const p = proof[i];
      if (index % 2 === 0) h = sha(h + p);
      else h = sha(p + h);
      index = Math.floor(index / 2);
    }
    return h === root;
  }

  verifyFinalizedTx(headerHash: string, txHash: string, proof: string[], index: number) {
    const H = this.headers.get(headerHash);
    if (!H) throw new Error("no header");
    if (!this.isFinal(H.height)) throw new Error("not final");
    return this.verifyTxInclusion(txHash, proof, index, H.txRoot);
  }
}

function sha(x: string) {
  return crypto.createHash("sha256").update(x).digest("hex");
                    }
