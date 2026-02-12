export interface OrderPayload {
  user: string;
  pair: string;
  side: "BUY" | "SELL";
  price: number;
  amount: number;
  nonce: number;
  timestamp: number;
}
