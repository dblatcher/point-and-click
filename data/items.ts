import type { ItemData } from "../src/definitions/ItemData";

export const items: ItemData[] = [
    {
        id: 'PASTA',
        name: 'big tube of pasta',
        type: 'item',
        imageId: 'tube.png',
    },
    {
        id: 'BUCKET',
        name: 'bucket',
        type: 'item',
        characterId: 'PLAYER',
        imageId: 'bucket.png',
    },
    {
        id: 'MATCHES',
        name: 'matches',
        type: 'item',
        characterId: 'PLAYER',
    },
    {
        id: 'HAMMER',
        name: 'hammer',
        type: 'item',
        characterId: 'MARIO',
    },
]