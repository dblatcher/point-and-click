import { Command, CommandTarget, ConversationChoice, GameData, Verb } from "point-click-lib";
import { GameProps } from "../../components/game/types";


export type GameStateAction =
    | { type: 'SET-PAUSED', isPaused: boolean }
    | { type: 'VERB-SELECT', verb: Verb }
    | { type: 'CONVERSATION-CHOICE', choice: ConversationChoice, props: GameProps }
    | { type: 'TARGET-CLICK', target: CommandTarget, props: GameProps }
    | { type: 'HANDLE-HOVER', target: CommandTarget, event: 'enter' | 'leave' }
    | { type: 'ROOM-CLICK', x: number, y: number, props: GameProps }
    | { type: 'SEND-COMMAND', command: Command, props: GameProps }
    | { type: 'SET-SCREEN-SIZE', height?: number, width?: number }
    | { type: 'TICK-UPDATE', props: GameProps }
    | { type: 'CLEAR-STORYBOARD' }
    | { type: 'RESTART', props: GameProps }
    | { type: 'HANDLE-LOAD', data: GameData, props: GameProps }

export type ActionWithoutProp =
    | { type: 'SEND-COMMAND', command: Command }
    | { type: 'TARGET-CLICK', target: CommandTarget }
    | { type: 'CONVERSATION-CHOICE', choice: ConversationChoice }
    | { type: 'TICK-UPDATE' }
    | { type: 'RESTART' }
    | { type: 'HANDLE-LOAD', data: GameData }
    | { type: 'ROOM-CLICK', x: number, y: number }
