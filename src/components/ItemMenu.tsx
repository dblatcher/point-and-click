/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import imageService from "../services/imageService";
import { ItemData } from "src"
import { HandleHoverFunction } from "./Game";
import uiStyles from './uiStyles.module.css';

interface Props {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}

export function ItemMenu({ items, currentItemId, select, handleHover }: Props) {
    const buttonOffClassNames = [uiStyles.button].join(" ")
    const buttonOnClassNames = [uiStyles.button, uiStyles.current].join(" ")

    return (
        <div className={uiStyles.frame}>
            <nav className={[uiStyles.contents, uiStyles.menu].join(" ")}>
                {items.map(item => {

                    const imageUrl = imageService.get(item.imageId || '')?.href;
                    const classNames = currentItemId === item.id
                        ? buttonOnClassNames
                        : buttonOffClassNames

                    return (
                        <button key={item.id} className={classNames}
                            style={{
                                backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                                minHeight: '3rem',
                            }}
                            onClick={() => { select(item) }}
                            onMouseEnter={handleHover ? () => { handleHover(item, 'enter') } : undefined}
                            onMouseLeave={handleHover ? () => { handleHover(item, 'leave') } : undefined}
                        >
                            <span>{item.name || item.id}</span>
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}