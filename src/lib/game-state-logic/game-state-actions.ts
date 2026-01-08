import { Command, CommandTarget, ConversationChoice, GameData, Verb } from "point-click-lib";
import { Dispatch } from "react";
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

export const makeDispatcherWithProps =
    (dispatch: Dispatch<GameStateAction>, props: GameProps) =>
        (action: GameStateAction | ActionWithoutProp) => {
            switch (action.type) {
                case "SEND-COMMAND":
                case "TARGET-CLICK":
                case "CONVERSATION-CHOICE":
                case "TICK-UPDATE":
                case "RESTART":
                case "HANDLE-LOAD":
                case "ROOM-CLICK":
                    return dispatch({ ...action, props })
                case "SET-PAUSED":
                case "VERB-SELECT":
                case "HANDLE-HOVER":
                case "SET-SCREEN-SIZE":
                case "CLEAR-STORYBOARD":
                    return dispatch(action)
            }
        }

export const getStoryboardCloseAction = (isEndOfGame?: boolean): ActionWithoutProp | GameStateAction => isEndOfGame ? { type: 'RESTART' } : { type: 'CLEAR-STORYBOARD' }

export const screenSizeAction = (width?: number, height?: number): GameStateAction => ({ type: 'SET-SCREEN-SIZE', height, width })
