import { LogEntry } from "@/lib/inGameDebugging";
import { ActorData, Command, Consequence, Order } from "@/definitions";
import { TypedEmitter } from "tiny-typed-emitter";

export interface OrderReport { type: 'order', order: Order, actor: ActorData }
export interface CommandReport { type: 'command', command: Command }
export interface ConsequenceReport { type: 'consequence', consequence: Consequence, success: boolean, offscreen: boolean }
export interface PromptFeedbackReport { message: string }

export type InGameEvent = OrderReport | CommandReport | ConsequenceReport

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
    'in-game-event': { (event: InGameEvent): void }
    'prompt-feedback': { (event: PromptFeedbackReport): void }
}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}
