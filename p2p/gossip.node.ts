import { EventEmitter } from "events";
import WebSocket from "ws";

export class GossipNode extends EventEmitter {
  peers: Set<WebSocket> = new Set();

  constructor(public port: number) {
    super();
  }

  start() {
    const server = new WebSocket.Server({ port: this.port });
    server.on("connection", ws => {
      this.peers.add(ws);
      ws.on("message", msg => this.onMessage(ws, msg.toString()));
      ws.on("close", () => this.peers.delete(ws));
    });
    console.log(`[Gossip] Node running on ${this.port}`);
  }

  connectPeer(url: string) {
    const ws = new WebSocket(url);
    ws.on("open", () => this.peers.add(ws));
    ws.on("message", msg => this.onMessage(ws, msg.toString()));
  }

  broadcast(type: string, payload: any) {
    const message = JSON.stringify({ type, payload });
    for (const peer of this.peers) peer.send(message);
  }

  onMessage(ws: WebSocket, raw: string) {
    const msg = JSON.parse(raw);
    this.emit(msg.type, msg.payload);
  }
}
