import crypto from "crypto";

type LedgerEntry = {
  ts: number;
  buyer: string;
  seller: string;
  pair: string;
  amount: number;
  price: number;
};

let stateRoot = "GENESIS";
const chain: LedgerEntry[] = [];

export function appendLedger(entry: LedgerEntry) {
  chain.push(entry);
  stateRoot = computeRoot(stateRoot, entry);
  console.log("New state root:", stateRoot);
}

function computeRoot(prev: string, e: LedgerEntry) {
  const h = crypto.createHash("sha256");
  h.update(prev + JSON.stringify(e));
  return h.digest("hex");
}

export function getStateRoot() {
  return stateRoot;
}
