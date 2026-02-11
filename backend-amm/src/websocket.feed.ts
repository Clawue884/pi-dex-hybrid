// backend-amm/src/websocket.feed.ts
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "ws";

@WebSocketGateway({ path: "/ws/markets" })
export class MarketFeedGateway {
  @WebSocketServer()
  server: Server;

  broadcastTrade(trade: any) {
    const msg = JSON.stringify({ type: "trade", data: trade });
    this.server.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(msg);
      }
    });
  }

  broadcastTicker(ticker: any) {
    const msg = JSON.stringify({ type: "ticker", data: ticker });
    this.server.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(msg);
      }
    });
  }
}
