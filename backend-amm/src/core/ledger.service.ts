import { createHash } from "crypto";

export interface LedgerEntry {
  txId: string;
  user: string;
  asset: string;
  amount: number;
  nonce: number;
}

export class DeterministicLedger {

  private ledger: LedgerEntry[] = [];
  private stateHash: string = "";

  apply(entry: LedgerEntry) {
    this.ledger.push(entry);
    this.recalculateState();
  }

  private recalculateState() {
    const sorted = [...this.ledger].sort((a, b) => {
      if (a.nonce === b.nonce) {
        return a.txId.localeCompare(b.txId);
      }
      return a.nonce - b.nonce;
    });

    const serialized = JSON.stringify(sorted);
    this.stateHash = createHash("sha256")
      .update(serialized)
      .digest("hex");
  }

  getStateHash(): string {
    return this.stateHash;
  }

  getLedger(): LedgerEntry[] {
    return this.ledger;
  }
}
