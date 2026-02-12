import * as crypto from 'crypto';

export interface ExecutionResult {
  wallet: string;
  delta: Record<string, number>;
}

export class SettlementWorker {
  private ledger: any[] = [];

  settleBatch(executions: ExecutionResult[]) {
    const ordered = executions.sort((a, b) =>
      crypto.createHash('sha256').update(JSON.stringify(a)).digest('hex')
        .localeCompare(
          crypto.createHash('sha256').update(JSON.stringify(b)).digest('hex')
        )
    );

    const stateDelta = {};
    for (const ex of ordered) {
      for (const [token, value] of Object.entries(ex.delta)) {
        stateDelta[token] = (stateDelta[token] || 0) + value;
      }
    }

    const stateRoot = crypto
      .createHash('sha256')
      .update(JSON.stringify(stateDelta))
      .digest('hex');

    const block = {
      height: this.ledger.length + 1,
      root: stateRoot,
      txCount: ordered.length,
      timestamp: Date.now(),
    };

    this.ledger.push(block);
    return block;
  }

  getLedger() {
    return this.ledger;
  }
}
