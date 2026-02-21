import { LogEntry } from "@/lib/inGameDebugging";
import { ActorData, Command, Consequence, ConversationBranch, GameData, Order, Stage } from "point-click-lib";
import { TypedEmitter } from "tiny-typed-emitter";
import { FeedItem } from "./text-based/types";
import { findById } from "./util";

export interface OrderReport { type: 'order', order: Order, actor: ActorData }
export interface CommandReport { type: 'command', command: Command }
export interface ConsequenceReport { type: 'consequence', consequence: Consequence, success: boolean, offscreen: boolean }
export interface ConversationBranchReport { type: 'conversation-branch', branch: ConversationBranch }
export interface SequenceStageReport { type: 'sequence-stage', stage: Stage }
export type PromptFeedbackReport = FeedItem;

export type InGameEvent = OrderReport | CommandReport | ConsequenceReport | ConversationBranchReport | SequenceStageReport

export interface GameEvents {
    'debugLog': { (logentry: LogEntry): void }
    'in-game-event': { (event: InGameEvent): void }
    'prompt-feedback': { (event: PromptFeedbackReport): void }
}

export class GameEventEmitter extends TypedEmitter<GameEvents> {

}

export const reportConversationBranch = (state: GameData, emitter:GameEventEmitter) => {
    const conversation = findById(state.currentConversationId, state.conversations)
    if (conversation) {
        const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]
        if (branch) {
            emitter.emit('in-game-event', { type: 'conversation-branch', branch })
        }
    }
}