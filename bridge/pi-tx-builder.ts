// bridge/pi-tx-builder.ts
export type PiTx = {
  from: string;
  to: string;
  amount: number;
  asset: string;
  memo: string;
  nonce: number;
};

export function buildPiTx(params: {
  from: string;
  to: string;
  amount: number;
  asset: string;
  stateRoot: string;
  batchId: string;
  nonce: number;
}): PiTx {
  return {
    from: params.from,
    to: params.to,
    amount: params.amount,
    asset: params.asset,
    nonce: params.nonce,
    memo: `PI-DEX|BATCH:${params.batchId}|ROOT:${params.stateRoot}`
  };
}
