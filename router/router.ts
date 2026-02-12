import { MEVGuardBatcher } from "../mev-guard/batcher";
import { ParallelMatchingEngine } from "../matching-engine/parallel";
import { settleBatch } from "../settlement/settlement.worker";

const batcher = new MEVGuardBatcher(async (batch) => {
  const orders = batch.map(b => b.payload);
  matching.submit("PI/USDT", orders);
});

const matching = new ParallelMatchingEngine("./worker.js");

export function submitOrder(order: any) {
  batcher.submitIntent(order);
}
