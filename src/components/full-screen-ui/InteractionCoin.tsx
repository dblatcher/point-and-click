import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { CommandTarget, ItemData, Verb } from "@/definitions";
import React, { useState } from "react";
import { VERB_BUTTON_SIZE, verbButtonStyle } from "./styles";
import { VerbButton } from "./VerbButton";

interface Props {
    target: CommandTarget,
    remove: { (): void }
}


export const InteractionCoin: React.FunctionComponent<Props> = ({ target, remove }) => {

    const { gameProps, updateGameState } = useGameState()
    const { inventory, isConversationRunning } = useGameStateDerivations()
    const { verbs } = gameProps
    const [verbNeedingItem, setVerbNeedingItem] = useState<Verb | undefined>(undefined)

    const relevantVerbs = target.type === 'item' ? verbs.filter(verb => !verb.isMoveVerb && !verb.isNotForItems) : verbs;

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

    return <div style={{
        backgroundColor: 'black',
        position: 'relative',
        pointerEvents: 'all',
        fontSize: 8,
        maxWidth: VERB_BUTTON_SIZE * (Math.max(relevantVerbs.length, 5))
    }}>
        <div style={{ display: 'flex' }}>
            {relevantVerbs.map(verb => (
                <VerbButton key={verb.id}
                    verb={verb}
                    isActive={verbNeedingItem?.id === verb.id}
                    handleClick={(verb) => handleVerbClick(verb, target)} />
            ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button
                disabled={!verbNeedingItem}
                style={verbButtonStyle}
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
                    style={verbButtonStyle}
                    onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        handleItemClick(item)
                    }}>
                    {item.id.substring(0, 4)}
                </button>
            ))}
        </div>
    </div>
}
