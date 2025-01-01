import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import React, { CSSProperties, useState } from "react";
import { ImageBlock } from "../ImageBlock";
import { VerbList } from "./VerbList";
import { ItemData, Verb } from "@/definitions";
import { findById } from "@/lib/util";
import { VERB_BUTTON_SIZE } from "./styles";

const buttonStyle = (isActive?: boolean): CSSProperties => ({
    position: 'relative',
    height: '4rem',
    minWidth: '4rem',
    backgroundColor: isActive ? 'red' : undefined,
})

export const InventoryDrawer: React.FunctionComponent = () => {
    const { updateGameState, gameProps } = useGameState()
    const { inventory } = useGameStateDerivations()
    const [isOpen, setIsOpen] = useState(false)

    const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined)
    const [activeVerbId, setActiveVerbId] = useState<string | undefined>(undefined)

    const selectItem = (item: ItemData) => {
        if (!activeItemId || !activeVerbId) {
            setActiveItemId(item.id)
            return
        }

        const firstItem = findById(activeItemId, inventory)
        const verb = findById(activeVerbId, gameProps.verbs)

        if (!firstItem || !verb) {
            return
        }

        updateGameState({ type: 'SEND-COMMAND', command: { verb, target: item, item: firstItem } })
    }

    const selectVerb = (verb: Verb) => {
        setActiveVerbId(undefined)
        if (!verb.preposition) {
            const item = findById(activeItemId, inventory)
            if (item) {
                updateGameState({ type: 'SEND-COMMAND', command: { verb, target: item } })
            }
            return
        }
        setActiveVerbId(verb.id)
    }

    return <div style={{
        display: 'flex'
    }}>
        <button
            disabled={inventory.length === 0 && !isOpen}
            style={buttonStyle(isOpen)}
            onClick={() => {
                setIsOpen(!isOpen)
                setActiveItemId(undefined)
                setActiveVerbId(undefined)
            }}>INV</button>

        {isOpen &&
            <>
                {inventory.map(item => (
                    <div key={item.id} style={{
                        overflow: 'visible'
                    }}>
                        <button
                            style={buttonStyle(activeItemId === item.id)}
                            onClick={() => selectItem(item)}
                        >
                            {item.imageId ?
                                <ImageBlock frame={{ imageId: item.imageId, row: item.row, col: item.col }} />
                                :
                                <span>{item.name || item.id}</span>
                            }
                        </button>
                        {activeItemId === item.id && (
                            <div style={{
                                position: 'absolute',
                                top: -VERB_BUTTON_SIZE,
                                zIndex: 10,
                            }}>
                                <VerbList activeVerbId={activeVerbId} selectVerb={selectVerb} />
                            </div>
                        )}
                    </div>
                ))}
            </>
        }
    </div>
}