/* eslint-disable @typescript-eslint/explicit-function-return-type */
import imageService from "@/services/imageService";
import { ItemData } from "../"
import { HandleHoverFunction } from "./Game";
import uiStyles from './uiStyles.module.css';
import { CSSProperties } from "react";

interface Props {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}

const buildBackground = (itemData: ItemData): CSSProperties | undefined => {

    const { imageId, row = 0, col = 0 } = itemData

    if (!imageId) { return undefined }
    const asset = imageService.get(imageId);
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

export function ItemMenu({ items, currentItemId, select, handleHover }: Props) {
    const buttonOffClassNames = [uiStyles.button].join(" ")
    const buttonOnClassNames = [uiStyles.button, uiStyles.current].join(" ")

    return (
        <div className={uiStyles.frame}>
            <nav className={[uiStyles.contents, uiStyles.menu].join(" ")}>
                {items.map(item => {
                    const backgroundStyle = buildBackground(item);
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
}