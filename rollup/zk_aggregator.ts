import crypto from "crypto";
import { ZkStateProver } from "../ledger/zk/zk_prover";

export class ZkRollupAggregator {
  prover = new ZkStateProver();

  aggregate(prevRoot: string, executions: any[]) {
    // Build deterministic state delta
    const delta = executions.reduce((acc, tx) => {
      for (const [k, v] of Object.entries(tx.delta || {})) {
        acc[k] = (acc[k] || 0) + (v as number);
      }
      return acc;
    }, {} as Record<string, number>);

    const newRoot = crypto
      .createHash("sha256")
      .update(prevRoot + JSON.stringify(delta))
      .digest("hex");

    const { proof, publicInputs } =
      this.prover.generateStateDeltaProof(prevRoot, newRoot, delta);

    return {
      batchSize: executions.length,
      prevRoot,
      newRoot,
      proof,
      publicInputs,
      delta
    };
  }
}
