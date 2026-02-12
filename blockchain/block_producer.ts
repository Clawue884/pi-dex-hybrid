import { ZkStateProver } from "../ledger/zk/zk_prover";

export class BlockProducer {
  prover = new ZkStateProver();

  produceBlock(prevRoot: string, newRoot: string, delta: any, txs: any[]) {
    const { proof, publicInputs } =
      this.prover.generateStateDeltaProof(prevRoot, newRoot, delta);

    return {
      height: Date.now(),
      txCount: txs.length,
      prevRoot,
      newRoot,
      proof,
      publicInputs,
      timestamp: Date.now(),
    };
  }
}
