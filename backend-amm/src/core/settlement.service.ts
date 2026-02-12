import { DeterministicLedger, LedgerEntry } from "./ledger.service";
import { SignatureService, SignedOrder } from "./signature.service";
import { v4 as uuidv4 } from "uuid";

export interface TradeExecution {
  buyer: string;
  seller: string;
  baseAsset: string;
  quoteAsset: string;
  baseAmount: number;
  quoteAmount: number;
  nonce: number;
}

export class SettlementEngine {

  private ledger: DeterministicLedger;

  constructor(ledger: DeterministicLedger) {
    this.ledger = ledger;
  }

  executeTrade(
    buyOrder: SignedOrder,
    sellOrder: SignedOrder,
    execution: TradeExecution
  ) {
    if (!SignatureService.verifySignature(buyOrder)) {
      throw new Error("Invalid buyer signature");
    }

    if (!SignatureService.verifySignature(sellOrder)) {
      throw new Error("Invalid seller signature");
    }

    const txId = uuidv4();

    const debitBuyer: LedgerEntry = {
      txId,
      user: execution.buyer,
      asset: execution.quoteAsset,
      amount: -execution.quoteAmount,
      nonce: execution.nonce,
    };

    const creditBuyer: LedgerEntry = {
      txId,
      user: execution.buyer,
      asset: execution.baseAsset,
      amount: execution.baseAmount,
      nonce: execution.nonce,
    };

    const debitSeller: LedgerEntry = {
      txId,
      user: execution.seller,
      asset: execution.baseAsset,
      amount: -execution.baseAmount,
      nonce: execution.nonce,
    };

    const creditSeller: LedgerEntry = {
      txId,
      user: execution.seller,
      asset: execution.quoteAsset,
      amount: execution.quoteAmount,
      nonce: execution.nonce,
    };

    this.ledger.apply(debitBuyer);
    this.ledger.apply(creditBuyer);
    this.ledger.apply(debitSeller);
    this.ledger.apply(creditSeller);

    return {
      txId,
      stateHash: this.ledger.getStateHash(),
    };
  }
}
