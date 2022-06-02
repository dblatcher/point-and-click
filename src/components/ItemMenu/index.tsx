/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ItemData } from "../../definitions/ItemData"


interface Props {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
}

export function ItemMenu({ items, currentItemId, select }: Props) {

    return (
        <nav>
            {items.map(item => (
                <button key={item.id} style={{
                    backgroundColor: currentItemId === item.id ? 'black' : 'white',
                    color: currentItemId === item.id ? 'white' : 'black',
                }} onClick={() => { select(item) }}>{item.name || item.id}</button>
            ))}
        </nav>
    )
}