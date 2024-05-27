import { LogEntry } from "@/lib/inGameDebugging";
import { Order } from "@/definitions";
import { TypedEmitter } from "tiny-typed-emitter";

export interface OrderReport { order: Order, actorId: string }

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
    'order': { (event: OrderReport): void }
}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}
