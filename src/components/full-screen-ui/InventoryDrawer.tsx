import { useGameStateDerivations } from "@/context/game-state-context";
import React, { CSSProperties, useState } from "react";
import { ImageBlock } from "../ImageBlock";
import { InteractionCoin } from "./InteractionCoin";

const buttonStyle = (isActive?: boolean): CSSProperties => ({
    position: 'relative',
    height: '4rem',
    minWidth: '4rem',
    backgroundColor: isActive ? 'red' : undefined,
})

export const InventoryDrawer: React.FunctionComponent = () => {
    const { inventory } = useGameStateDerivations()
    const [isOpen, setIsOpen] = useState(false)

    const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined)

    return <div style={{
        display: 'flex'
    }}>
        <button
            disabled={inventory.length === 0 && !isOpen}
            style={buttonStyle(isOpen)}
            onClick={() => {
                setIsOpen(!isOpen)
                setActiveItemId(undefined)
            }}>INV</button>

        {isOpen &&
            <>
                {inventory.map(item => (
                    <div key={item.id} style={{
                        overflow: 'visible'
                    }}>
                        <button
                            style={buttonStyle(activeItemId === item.id)}
                            onClick={() => { setActiveItemId(item.id) }}
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
                                top: '-100%',
                                zIndex: 10,
                            }}>
                                <InteractionCoin target={item} remove={() => { setActiveItemId(undefined) }} />
                            </div>
                        )}
                    </div>
                ))}
            </>
        }
    </div>
}