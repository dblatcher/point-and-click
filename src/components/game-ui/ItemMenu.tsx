
import { ItemData } from "@/definitions"
import uiStyles from '@/components/game-ui/uiStyles.module.css';
import { CSSProperties, memo } from "react";
import { ItemMenuProps, itemMenuPropsAreEqual } from '@/components/game/uiComponentSet'
import { HandleHoverFunction } from "../game/types";
import { useGameStateDerivations } from "@/context/game-state-context";
import { useAssets } from "@/context/asset-context";
import { ImageAsset } from "@/services/assets";


export const ItemMenu = (props: {
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}) => {
    const { inventory, currentItem } = useGameStateDerivations()
    return <ItemMenuInner {...props} items={inventory} currentItemId={currentItem?.id} />
}


const buildBackground = (itemData: ItemData, getAsset:{(id:string):ImageAsset|undefined}): CSSProperties | undefined => {
    const { imageId, row = 0, col = 0 } = itemData
    if (!imageId) { return undefined }
    const asset = getAsset(imageId);
    if (!asset) { return undefined }

    const { href: imageUrl, cols, rows } = asset

    if (typeof cols === 'undefined' && typeof rows === 'undefined') {
        return {
            backgroundImage: `url(${imageUrl})`,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        }
    }

    return {
        backgroundImage: `url(${imageUrl})`,
        backgroundPositionX: `${-100 * col}%`,
        backgroundPositionY: `${-100 * row}%`,
        backgroundSize: `${100 * (cols || 1)}% ${100 * (rows || 1)}%`,
        width: '100%',
        height: '100%',
    }
}

export const ItemMenuInner = memo(
    function ItemMenu({ items, currentItemId, select, handleHover }: ItemMenuProps) {
        const { getImageAsset } = useAssets()
        const buttonOffClassNames = [uiStyles.button].join(" ")
        const buttonOnClassNames = [uiStyles.button, uiStyles.current].join(" ")
        return (
            <div className={uiStyles.frame}>
                <nav className={[uiStyles.contents, uiStyles.menu].join(" ")}>
                    {items.map(item => {
                        const backgroundStyle = buildBackground(item, getImageAsset);
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
                                {backgroundStyle ?
                                    <div style={backgroundStyle} />
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