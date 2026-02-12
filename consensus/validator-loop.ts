import { getActiveValidators } from "./staking";
import { getStateRoot } from "../ledger/ledger";

export async function validatorLoop() {
  const validators = getActiveValidators();

  for (const v of validators) {
    const proposedRoot = getStateRoot();

    // Simple deterministic voting
    const vote = proposedRoot; // extend later with signature

    console.log(`Validator ${v.id} votes for root ${vote}`);
  }
}
