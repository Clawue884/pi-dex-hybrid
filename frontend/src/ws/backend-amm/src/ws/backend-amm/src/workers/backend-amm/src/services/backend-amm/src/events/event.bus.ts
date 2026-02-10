import { EventEmitter } from "events";
export const EventBus = new EventEmitter();

// events:
// - "trade:matched"  payload: Trade
// - "trade:settled"  payload: SettlementResult
