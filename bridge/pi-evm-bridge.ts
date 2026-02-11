// bridge/pi-evm-bridge.ts
// Skeleton bridge coordinator (off-chain relayer style)

import crypto from "crypto";

interface LockEvent {
  from: string;
  to: string;
  amount: number;
  chain: "PI" | "EVM";
  nonce: number;
}

export class PiEvmBridge {
  private nonces: Record<string, number> = {};

  lockOnPi(from: string, toEvm: string, amount: number): LockEvent {
    const n = (this.nonces[from] || 0) + 1;
    this.nonces[from] = n;
    return { from, to: toEvm, amount, chain: "PI", nonce: n };
  }

  mintOnEvm(lock: LockEvent) {
    const sig = this.sign(JSON.stringify(lock));
    return { action: "MINT", to: lock.to, amount: lock.amount, sig };
  }

  burnOnEvm(from: string, toPi: string, amount: number): LockEvent {
    const n = (this.nonces[from] || 0) + 1;
    this.nonces[from] = n;
    return { from, to: toPi, amount, chain: "EVM", nonce: n };
  }

  releaseOnPi(burn: LockEvent) {
    const sig = this.sign(JSON.stringify(burn));
    return { action: "RELEASE", to: burn.to, amount: burn.amount, sig };
  }

  private sign(payload: string) {
    return crypto.createHash("sha256").update(payload).digest("hex");
  }
}
