import WebSocket, { WebSocketServer } from "ws";
import crypto from "crypto";
import { encryptMessage, decryptMessage } from "./crypto";

const peers = new Set<WebSocket>();
const secretKey = crypto.randomBytes(32);

export function startGossipServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", ws => {
    peers.add(ws);

    ws.on("message", (data: Buffer) => {
      broadcast(data);
    });

    ws.on("close", () => peers.delete(ws));
  });

  console.log("Gossip server running on", port);
}

export function connectToPeer(url: string) {
  const ws = new WebSocket(url);

  ws.on("open", () => console.log("Connected to peer:", url));
  ws.on("message", data => broadcast(data));
}

export function broadcast(data: any) {
  for (const peer of peers) {
    if (peer.readyState === WebSocket.OPEN) {
      peer.send(data);
    }
  }
}

export function sendEncryptedIntent(intent: any) {
  const msg = JSON.stringify(intent);
  const { encrypted, iv, tag } = encryptMessage(msg, secretKey);

  const payload = JSON.stringify({
    encrypted: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex")
  });

  broadcast(payload);
}
