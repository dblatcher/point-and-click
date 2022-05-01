import { Direction } from "./SpriteSheet"

type Ident = {
    type: string
    id: string
    name?: string
    status?: string
}

type SpriteParams = {
    height: number
    width: number
    sprite: string
    direction?: Direction
    filter?: string
}

interface Position {
    room?: string
    x: number
    y: number
}

export type { Ident, SpriteParams, Position }