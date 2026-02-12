export interface Validator {
  id: string;
  stake: number;
  jailed: boolean;
}

export class StakingSlashing {
  validators: Map<string, Validator> = new Map();

  register(id: string, stake: number) {
    this.validators.set(id, { id, stake, jailed: false });
  }

  slash(id: string, amount: number, reason: string) {
    const v = this.validators.get(id);
    if (!v) return;
    v.stake -= amount;
    if (v.stake < 0) v.stake = 0;
    v.jailed = true;
    console.log(`[Slashing] ${id} slashed for ${amount} — ${reason}`);
  }

  reward(id: string, amount: number) {
    const v = this.validators.get(id);
    if (!v || v.jailed) return;
    v.stake += amount;
  }

  unjail(id: string) {
    const v = this.validators.get(id);
    if (v) v.jailed = false;
  }
}
