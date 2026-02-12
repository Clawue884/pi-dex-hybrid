export class BFTFinality {
  validators: string[];

  constructor(validators: string[]) {
    this.validators = validators;
  }

  verifyVotes(votes: string[]) {
    const quorum = Math.ceil((2 / 3) * this.validators.length);
    return votes.length >= quorum;
  }
}
