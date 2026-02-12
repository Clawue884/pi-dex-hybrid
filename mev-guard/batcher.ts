// mev-guard/batcher.ts
import crypto from "crypto";

export type Intent = {
  hash: string;
  payload: any;
  ts: number;
};

export class MEVGuardBatcher {
  private mempool: Intent[] = [];
  private batchIntervalMs = 500;
  private timer?: NodeJS.Timeout;

  constructor(private onBatch: (batch: Intent[]) => void) {}

  start() {
    this.timer = setInterval(() => this.flush(), this.batchIntervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  submitIntent(payload: any) {
    const hash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    this.mempool.push({ hash, payload, ts: Date.now() });
  }

  private flush() {
    if (this.mempool.length === 0) return;

    // Fair ordering: sort by timestamp + hash (anti front-run bias)
    const batch = this.mempool
      .sort((a, b) => a.ts - b.ts || a.hash.localeCompare(b.hash))
      .slice(0, 1000);

    this.mempool = this.mempool.filter((i) => !batch.includes(i));
    this.onBatch(batch);
  }
}
