import { appendLedger } from "../ledger/ledger";

export type Trade = {
  buyer: string;
  seller: string;
  pair: string;
  price: number;
  amount: number;
};

export async function settleBatch(trades: Trade[]) {
  for (const t of trades) {
    appendLedger({
      ts: Date.now(),
      buyer: t.buyer,
      seller: t.seller,
      pair: t.pair,
      amount: t.amount,
      price: t.price
    });
  }
}
