import { LogEntry } from "@/lib/inGameDebugging";
import { Command, Order } from "@/definitions";
import { TypedEmitter } from "tiny-typed-emitter";

export interface OrderReport { order: Order, actorId: string }
export interface CommandReport { command: Command }

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
    'order': { (event: OrderReport): void }
    'command': { (event: CommandReport): void }

}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}
