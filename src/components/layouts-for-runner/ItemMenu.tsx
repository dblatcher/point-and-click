
import { ItemMenuProps } from '@/components/game/uiComponentSet';
import { GameDataContext, UiStateContext } from 'point-click-components';
import { useContext } from "react";
import { ImageBlock } from "../ImageBlock";
import uiStyles from './uiStyles.module.css';
import { findById } from '@/lib/util';


export const ItemMenu = () => {
    const { dispatchUi, uiState } = useContext(UiStateContext)
    const { dispatch, gameState, gameDesign } = useContext(GameDataContext)
    const { itemId: currentItemId, verbId } = uiState

    const player = gameState.actors.find(a => a.isPlayer)
    const inventory = player ? gameState.items.filter(i => i.actorId === player.id) : []
    const verb = findById(verbId, gameDesign.verbs)

    return <ItemMenuInner
        handleHover={(hoverTarget, event) => dispatchUi({ type: 'SET_HOVER_TARGET', hoverTarget: event === 'enter' ? hoverTarget : undefined, })}
        items={inventory}
        currentItemId={currentItemId}
        select={(item) => {
            if (!currentItemId && verb?.preposition) {
                return dispatchUi({ type: 'SET_ITEM', itemId: item.id })
            }
            if (item.id === currentItemId) {
                return dispatchUi({ type: 'SET_ITEM', itemId: undefined })
            }
            dispatchUi({ type: 'SET_ITEM', itemId: undefined })
            dispatch({ type: 'TARGET-CLICK', target: item, verbId, itemId: currentItemId })
        }}
    />
}

export const ItemMenuInner =
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
    }
