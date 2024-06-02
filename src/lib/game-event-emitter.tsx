import { LogEntry } from "@/lib/inGameDebugging";
import { ActorData, Command, Consequence, Order } from "@/definitions";
import { TypedEmitter } from "tiny-typed-emitter";

export interface OrderReport { order: Order, actor: ActorData }
export interface CommandReport { command: Command }
export interface ConsequenceReport { consequence: Consequence, success: boolean }

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
    'order': { (event: OrderReport): void }
    'command': { (event: CommandReport): void }
    'consequence': { (event: ConsequenceReport): void }
}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}
