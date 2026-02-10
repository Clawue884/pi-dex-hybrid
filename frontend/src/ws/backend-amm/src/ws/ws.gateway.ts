import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { EventBus } from "../events/event.bus";

@WebSocketGateway({ cors: { origin: "*" } })
export class WsGateway {
  @WebSocketServer()
  server!: Server;

  constructor() {
    EventBus.on("trade:settled", (payload) => {
      this.server.emit("trade:settled", payload);
    });
  }
}
