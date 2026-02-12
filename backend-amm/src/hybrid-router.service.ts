import { Injectable } from "@nestjs/common";
import { AmmService } from "./amm.service";
import { SettlementWorker } from "./workers/settlement.worker";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class HybridRouterService {
  constructor(
    private readonly amm: AmmService,
    private readonly worker: SettlementWorker
  ) {}

  async route(params: {
    pair: string;
    amountIn: number;
    minOut: number;
    signedOrder: any;
    counterparty: any;
    nonce: number;
  }) {
    const ammQuote = this.amm.quote(params.pair, params.amountIn, true);

    let obQuote = 0;
    try {
      const res = await axios.get(
        `http://orderbook:8000/quote?pair=${params.pair}&amount=${params.amountIn}`
      );
      obQuote = res.data.amountOut;
    } catch {
      obQuote = 0;
    }

    const route = obQuote > ammQuote ? "ORDERBOOK" : "AMM";

    const execution = {
      buyer: JSON.parse(params.signedOrder.payload).user,
      seller: JSON.parse(params.counterparty.payload).user,
      baseAsset: "A",
      quoteAsset: "B",
      baseAmount: route === "AMM" ? ammQuote : obQuote,
      quoteAmount: params.amountIn,
      nonce: params.nonce
    };

    const jobId = uuidv4();

    this.worker.enqueue({
      id: jobId,
      payload: {
        buyOrder: params.signedOrder,
        sellOrder: params.counterparty,
        execution
      },
      retries: 0
    });

    return {
      status: "ENQUEUED",
      route,
      jobId
    };
  }
}
