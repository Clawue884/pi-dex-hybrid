import { ZkStateProver } from "../ledger/zk/zk_prover";

export class ValidatorLoop {
  prover = new ZkStateProver();

  validateBlock(block: any) {
    const ok = this.prover.verifyProof(block.proof, block.publicInputs);

    if (!ok) {
      throw new Error("Invalid zk-proof");
    }

    console.log(`[Validator] Block ${block.height} verified`);
    return true;
  }
}
