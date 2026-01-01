import { ActorData, Command, Consequence, Order, Stage } from "point-click-lib"
import { LogEntry, makeDebugEntry, } from "../inGameDebugging"
import { GameState } from "./types"

const makeConsequenceReportEmitter = (state: GameState) => (consequence: Consequence, success: boolean, offscreen: boolean) => {
    state.emitter.emit('in-game-event', { type: 'consequence', consequence, success, offscreen })
}

const makeCommandReportEmitter = (state: GameState) => (command: Command) => {
    state.emitter.emit('in-game-event', { type: 'command', command })
}

const makeOrderReportEmitter = (state: GameState) => (order: Order, actor: ActorData) => {
    state.emitter.emit('in-game-event', { type: 'order', order, actor })
}

const makeSequenceStageReportEmitter = (state: GameState) => (stage: Stage) => {
    state.emitter.emit('in-game-event', { type: 'sequence-stage', stage })
}

export const makeEventReporter = (state: GameState) => {
    return {
        reportConsequence: makeConsequenceReportEmitter(state),
        reportCommand: makeCommandReportEmitter(state),
        reportOrder: makeOrderReportEmitter(state),
        reportStage: makeSequenceStageReportEmitter(state)
    }
}

export const makeDebugLogEmitter = (state: GameState) => (message: string, subject?: LogEntry['subject']) => {
    state.emitter.emit('debugLog', makeDebugEntry(message, subject))
}

export type DebugLogger = ReturnType<typeof makeDebugLogEmitter>;
export type ReportConsequence = ReturnType<typeof makeConsequenceReportEmitter>
