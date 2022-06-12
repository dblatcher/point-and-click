export interface SpriteSheet {
    id: string;
    url: string;
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

export type Direction = 'left' | 'right'
export const directions: Direction[] = ['left', 'right']

export interface SpriteData {
    id: string;
    defaultDirection: Direction;
    animations: Record<string,Partial<Record<Direction, SpriteFrame[]>>>;
}


