import { Ident, Position, SpriteParams } from "./BaseTypes"

type CharacterData  = Ident & SpriteParams & Position & {
    type: 'character';
    isPlayer?: boolean;
    speed?: number;
    dialogueColor?: string;
}

export type { CharacterData }
