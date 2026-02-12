export enum NodeRole {
  FOLLOWER = "FOLLOWER",
  CANDIDATE = "CANDIDATE",
  LEADER = "LEADER",
}

export class ConsensusNode {
  role: NodeRole = NodeRole.FOLLOWER;
  currentTerm = 0;
  votedFor: string | null = null;

  startElection() {
    this.role = NodeRole.CANDIDATE;
    this.currentTerm++;
    this.votedFor = "self";
    console.log(`[Consensus] Election started. Term ${this.currentTerm}`);
  }

  receiveVote(term: number) {
    if (term >= this.currentTerm) {
      this.currentTerm = term;
      this.role = NodeRole.LEADER;
      console.log(`[Consensus] Became LEADER at term ${term}`);
    }
  }

  proposeBlock(block: any) {
    if (this.role !== NodeRole.LEADER) return null;
    return { ...block, term: this.currentTerm };
  }
}
