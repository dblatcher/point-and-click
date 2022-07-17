import { Direction, directions } from "./BaseTypes"

export interface SpriteSheet {
    id: string;
    imageId: string;
    rows: number;
    cols: number;
    widthScale?: number;
    heightScale?: number;
}


export interface SpriteFrame {
    sheetId: string;
    row: number;
    col: number;
}



export interface SpriteData {
    id: string;
    defaultDirection: Direction;
    animations: Record<string,Partial<Record<Direction, SpriteFrame[]>>>;
}


export {Direction, directions}