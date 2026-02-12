// zk-rollup/aggregator.ts
import crypto from "crypto";

export type StateDiff = {
  account: string;
  delta: Record<string, number>;
};

export type RollupBatch = {
  id: string;
  diffs: StateDiff[];
  prevRoot: string;
  newRoot: string;
};

export class ZkRollupAggregator {
  private diffs: StateDiff[] = [];
  private lastRoot = "GENESIS";

  constructor(private onBatchReady: (batch: RollupBatch) => Promise<void>) {}

  submitDiff(diff: StateDiff) {
    this.diffs.push(diff);
    if (this.diffs.length >= 256) {
      this.aggregate();
    }
  }

  private async aggregate() {
    const batchDiffs = this.diffs.splice(0, 256);
    const newRoot = this.computeRoot(batchDiffs);

    const batch: RollupBatch = {
      id: crypto.randomUUID(),
      diffs: batchDiffs,
      prevRoot: this.lastRoot,
      newRoot,
    };

    this.lastRoot = newRoot;
    await this.onBatchReady(batch); // hook to zk-prover / on-chain submitter
  }

  private computeRoot(diffs: StateDiff[]): string {
    const h = crypto.createHash("sha256");
    h.update(this.lastRoot);
    for (const d of diffs) {
      h.update(d.account + JSON.stringify(d.delta));
    }
    return h.digest("hex");
  }
}
