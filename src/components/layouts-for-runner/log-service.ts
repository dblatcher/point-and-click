import { ActorData, Command, Consequence, InGameEventReporter, Order, Stage } from 'point-click-lib'
import { TypedEmitter } from 'tiny-typed-emitter'

// TODO - there should only be one event for LogEntry
const emitter = new TypedEmitter<{
    consequence: { (consequence: Consequence): void },
    command: { (command: Command): void },
    order: { (order: Order): void },
    stage: { (stage: Stage): void },
    conversation: { (): void },
}>()

const reporter: InGameEventReporter = {
    reportConsequence: function (consequence: Consequence, success: boolean, offscreen: boolean): void {
        emitter.emit('consequence', consequence)
    },
    reportCommand: function (command: Command): void {
        emitter.emit('command', command)
    },
    reportOrder: function (order: Order, actor: ActorData): void {
        emitter.emit('order', order)
    },
    reportStage: function (stage: Stage): void {
        emitter.emit('stage', stage)
    },
    reportCurrentConversation: function (): void {
        emitter.emit('conversation')
    }
}

export const logService = {
    emitter,
    reporter
}