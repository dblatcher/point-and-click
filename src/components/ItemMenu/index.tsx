/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import imageService from "../../services/imageService";
import { ItemData } from "src"
import styles from './styles.module.css';
import { HandleHoverFunction } from "../Game";

interface Props {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}

export function ItemMenu({ items, currentItemId, select, handleHover }: Props) {

    return (
        <nav>
            {items.map(item => {

                const imageUrl = imageService.get(item.imageId || '')?.href;
                const classNames = currentItemId === item.id
                    ? [styles.button, styles.current].join(" ")
                    : [styles.button].join(" ")

                return (
                    <button key={item.id} className={classNames}
                        style={{
                            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                        }}
                        onClick={() => { select(item) }}
                        onMouseEnter = { handleHover ? () => { handleHover(item, 'enter')} : undefined}
                        onMouseLeave = { handleHover ? () => { handleHover(item, 'leave')} : undefined}
                        >
                        <span>{item.name || item.id}</span>
                    </button>
                )



            })}
        </nav>
    )
}