import { getValidator } from "./staking";

export function slashValidator(id: string, penaltyPercent = 5) {
  const v = getValidator(id);
  if (!v) throw new Error("Validator not found");

  const penalty = (v.stake * penaltyPercent) / 100;
  v.stake -= penalty;
  v.reputation -= 10;

  if (v.stake <= 0 || v.reputation <= 0) {
    v.active = false;
  }

  console.log(`Validator ${id} slashed. Penalty: ${penalty}`);
}
