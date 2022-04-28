import { ItemData } from "../../definitions/ItemData"


interface Props {
    items: ItemData[]
    currentItemId: string
    select: { (item: ItemData): void }
}

export function ItemMenu({ items, currentItemId, select }: Props) {

    return (
        <nav>
            {items.map(item => (
                <button style={{
                    backgroundColor: currentItemId === item.id ? 'black' : 'white',
                    color: currentItemId === item.id ? 'white' : 'black',
                }} onClick={() => { select(item) }}>{item.name || item.id}</button>
            ))}
        </nav>
    )
}