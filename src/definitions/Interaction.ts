interface Interaction {
    verbId: string
    targetId: string
    roomId?: string
    itemId?: string
    consequences: any[]
}

export type { Interaction }