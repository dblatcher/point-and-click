import { Ident } from "./BaseTypes"

type ItemData = Ident & {
    type: 'item';
    characterId?: string;
    imageId?: string;
}

export type { ItemData }