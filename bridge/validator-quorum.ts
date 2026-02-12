// bridge/validator-quorum.ts
import crypto from "crypto";

export type Validator = {
  id: string;
  pubKey: string;
};

const validators: Validator[] = [];

export function registerValidator(v: Validator) {
  validators.push(v);
}

export function verifyQuorumSignatures(
  root: string,
  signatures: { validatorId: string; sig: string }[],
  minQuorum = 3
): boolean {
  let valid = 0;

  for (const s of signatures) {
    const v = validators.find(x => x.id === s.validatorId);
    if (!v) continue;

    const verify = crypto.createVerify("SHA256");
    verify.update(root);
    verify.end();

    if (verify.verify(v.pubKey, s.sig, "hex")) {
      valid++;
    }
  }

  return valid >= minQuorum;
}
