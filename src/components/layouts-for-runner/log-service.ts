import { GameEventEmitter } from '@/lib/game-event-emitter'
import { makeDebugEntry } from '@/lib/inGameDebugging'
import { ActorData, Command, Consequence, InGameEventReporter, LogToDebug, Order, Stage, } from 'point-click-lib'

// TODO - there should only be one event for LogEntry
const emitter = new GameEventEmitter



const reporter: InGameEventReporter = {
    reportConsequence: function (consequence: Consequence, success: boolean, offscreen: boolean): void {
        emitter.emit('in-game-event', { type: 'consequence', consequence, success, offscreen })
    },
    reportCommand: function (command: Command): void {
        emitter.emit('in-game-event', { type: 'command', command })
    },
    reportOrder: function (order: Order, actor: ActorData): void {
        emitter.emit('in-game-event', { type: 'order', order, actor })
    },
    reportStage: function (stage: Stage): void {
        emitter.emit('in-game-event', { type: 'sequence-stage', stage })
    },
    reportCurrentConversation: function (): void {
        // emitter.emit('in-game-event', {type:'conversation-branch', branch:''})
    }
}

const logToDebug: LogToDebug = (message, subject) => emitter.emit('debugLog', makeDebugEntry(message, subject))

export const logService = {
    emitter,
    reporter,
    logToDebug,
}