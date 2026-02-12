import crypto from "crypto";

export type Validator = {
  id: string;
  stake: number;
  active: boolean;
  reputation: number;
};

const validators = new Map<string, Validator>();

export function registerValidator(id: string, stake: number) {
  if (validators.has(id)) throw new Error("Already registered");

  validators.set(id, {
    id,
    stake,
    active: true,
    reputation: 100
  });
}

export function getValidator(id: string) {
  return validators.get(id);
}

export function getActiveValidators(): Validator[] {
  return [...validators.values()].filter(v => v.active);
}
