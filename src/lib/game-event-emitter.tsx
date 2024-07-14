import { LogEntry } from "@/lib/inGameDebugging";
import { ActorData, Command, Consequence, ConversationBranch, Order, Stage } from "@/definitions";
import { TypedEmitter } from "tiny-typed-emitter";
import { GameState } from "@/components/game";
import { findById } from "./util";

export interface OrderReport { type: 'order', order: Order, actor: ActorData }
export interface CommandReport { type: 'command', command: Command }
export interface ConsequenceReport { type: 'consequence', consequence: Consequence, success: boolean, offscreen: boolean }
export interface ConversationBranchReport { type: 'conversation-branch', branch: ConversationBranch }
export interface SequenceStageReport { type: 'sequence-stage', stage: Stage }
export interface PromptFeedbackReport { message: string, type?: 'system' | 'dialogue', list?: string[] }

export type InGameEvent = OrderReport | CommandReport | ConsequenceReport | ConversationBranchReport | SequenceStageReport

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
    'in-game-event': { (event: InGameEvent): void }
    'prompt-feedback': { (event: PromptFeedbackReport): void }
}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}

export const reportConversationBranch = (state: GameState) => {
    const conversation = findById(state.currentConversationId, state.conversations)
    if (conversation) {
        const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]
        if (branch) {
            state.emitter.emit('in-game-event', { type: 'conversation-branch', branch })
        }
    }
}