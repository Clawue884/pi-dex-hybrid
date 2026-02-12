import { getStateRoot } from "../ledger/ledger";

export async function produceBlock() {
  const root = getStateRoot();
  console.log("Producing block with root:", root);
  // hook ke zk / submitter / broadcaster
}
