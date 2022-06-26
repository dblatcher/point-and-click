/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import imageService from "../../services/imageService";
import { ItemData } from "../../definitions/ItemData"
import styles from './styles.module.css';

interface Props {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
}

export function ItemMenu({ items, currentItemId, select }: Props) {

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
                        onClick={() => { select(item) }}>
                        <span>{item.name || item.id}</span>
                    </button>
                )



            })}
        </nav>
    )
}