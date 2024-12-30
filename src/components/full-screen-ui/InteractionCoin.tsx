import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { ActorData, CommandTarget, HotspotZone, ItemData, Verb } from "@/definitions";
import React, { useState } from "react";

interface Props {
    target: ActorData | HotspotZone,
    remove: { (): void }
}

const BUTTON_SIZE = 20

const buttonStyle = {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    padding: 1,
    fontSize: 'inherit',
}

export const InteractionCoin: React.FunctionComponent<Props> = ({ target, remove }) => {

    const { gameProps, updateGameState } = useGameState()
    const { inventory, isConversationRunning} = useGameStateDerivations()
    const { verbs } = gameProps

    const [verbNeedingItem, setVerbNeedingItem] = useState<Verb | undefined>(undefined)

    const handleVerbClick = (verb: Verb, target: CommandTarget) => {
        if (verb.preposition) {
            setVerbNeedingItem(verb)
            return
        }
        remove()
        updateGameState({
            type: 'SEND-COMMAND',
            command: {
                target,
                verb
            }
        })
    }

    const handleItemClick = (item?: ItemData) => {
        if (!verbNeedingItem) {
            return
        }
        remove()
        updateGameState({
            type: 'SEND-COMMAND',
            command: {
                target,
                verb: verbNeedingItem,
                item,
            }
        })
        setVerbNeedingItem(undefined)
    }

    if (isConversationRunning) {
        return null
    }

    return <>
        <foreignObject overflow={'visible'} width={"1"} height={"1"}>
            <div style={{
                backgroundColor: 'tomato',
                position: 'relative',
                pointerEvents: 'all',
                fontSize: 8,
                transform: "translateY(-100%)"
            }}>
                <div style={{ display: 'flex' }}>
                    {verbs.map(verb => (
                        <button key={verb.id}
                            style={{
                                ...buttonStyle,
                                backgroundColor: verbNeedingItem?.id === verb.id ? 'red' : undefined
                            }}
                            onClick={(event) => {
                                event.stopPropagation()
                                event.preventDefault()
                                handleVerbClick(verb, target)
                            }}>
                            {verb.label.substring(0, 3)}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex' }}>
                    <button
                        disabled={!verbNeedingItem}
                        style={buttonStyle}
                        onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleItemClick(undefined)
                        }}>
                        0
                    </button>
                    {inventory.map(item => (
                        <button key={item.id}
                            disabled={!verbNeedingItem}
                            style={buttonStyle}
                            onClick={(event) => {
                                event.stopPropagation()
                                event.preventDefault()
                                handleItemClick(item)
                            }}>
                            {item.id.substring(0, 3)}
                        </button>
                    ))}
                </div>

            </div>
        </foreignObject>
    </>

}
