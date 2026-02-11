// bridge/pi/pi-bridge.ts
import { PiLightClient } from "./pi-light-client";

export class PiBridge {
  lc: PiLightClient;
  used = new Set<string>();

  constructor(lc: PiLightClient) {
    this.lc = lc;
  }

  // Verify EVM burn tx inclusion (header + proof from EVM light client mirror)
  releaseWithProof(
    headerHash: string,
    evmTxHash: string,
    proof: string[],
    index: number,
    toPi: string,
    amount: number
  ) {
    if (this.used.has(evmTxHash)) throw new Error("used");
    const ok = this.lc.verifyFinalizedTx(headerHash, evmTxHash, proof, index);
    if (!ok) throw new Error("bad proof");
    this.used.add(evmTxHash);

    // call Pi VM to credit `toPi` with `amount`
    return { status: "RELEASED_ON_PI", to: toPi, amount, txHash: evmTxHash };
  }
}
