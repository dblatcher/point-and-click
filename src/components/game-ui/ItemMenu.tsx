
import uiStyles from '@/components/game-ui/uiStyles.module.css';
import { ItemMenuProps, itemMenuPropsAreEqual } from '@/components/game/uiComponentSet';
import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { memo } from "react";
import { ImageBlock } from "../ImageBlock";


export const ItemMenu = () => {
    const { updateGameState } = useGameState()
    const { inventory, currentItem } = useGameStateDerivations()
    return <ItemMenuInner 
        handleHover={(target, event) => updateGameState({ type: 'HANDLE-HOVER', target, event })}
        items={inventory} 
        currentItemId={currentItem?.id} 
        select={(item) => updateGameState({ type: 'TARGET-CLICK', target: item })} 
    />
}

export const ItemMenuInner = memo(
    function ItemMenu({ items, currentItemId, select, handleHover }: ItemMenuProps) {
        const buttonOffClassNames = [uiStyles.button].join(" ")
        const buttonOnClassNames = [uiStyles.button, uiStyles.current].join(" ")
        return (
            <div className={uiStyles.frame}>
                <nav className={[uiStyles.contents, uiStyles.menu].join(" ")}>
                    {items.map(item => {
                        const classNames = currentItemId === item.id
                            ? buttonOnClassNames
                            : buttonOffClassNames

                        return (
                            <button key={item.id} className={classNames}
                                style={{
                                    position: 'relative',
                                    minHeight: '4rem',
                                }}
                                onClick={() => { select(item) }}
                                onMouseEnter={handleHover ? () => { handleHover(item, 'enter') } : undefined}
                                onMouseLeave={handleHover ? () => { handleHover(item, 'leave') } : undefined}
                            >
                                {item.imageId ?
                                    <ImageBlock frame={{ imageId: item.imageId, row: item.row, col: item.col }} />
                                    :
                                    <span>{item.name || item.id}</span>
                                }
                            </button>
                        )
                    })}
                </nav>
            </div>
        )
    },
    itemMenuPropsAreEqual
)