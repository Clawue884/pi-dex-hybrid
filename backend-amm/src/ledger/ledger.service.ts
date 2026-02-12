export class LedgerService {
  private blocks: any[] = [];

  applyBlock(block: any) {
    this.blocks.push(block);
  }

  getLatestRoot() {
    return this.blocks.at(-1)?.root || null;
  }

  getHeight() {
    return this.blocks.length;
  }
}
