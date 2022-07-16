import { Consequence, Interaction, ConsequenceType, AnyConsequence } from "../../../definitions/Interaction";

export function makeNewConsequence(type: ConsequenceType): Consequence {
    switch (type) {
        case 'conversation':
            return { type: 'conversation', conversationId: '' }
        case 'sequence':
            return { type: 'sequence', sequence: '' }
        case 'changeStatus':
            return { type: 'changeStatus', targetId: '', status: '', targetType: 'character' }
        case 'removeCharacter':
            return { type: 'removeCharacter', characterId: '' }
        case 'inventory':
            return { type: "inventory", itemId: '', addOrRemove: 'ADD' }
        case 'changeRoom':
            return { type: 'changeRoom', roomId: '', takePlayer: true, x: 0, y: 0 }
        case 'talk':
            return { type: 'talk', text: '', characterId: '', time: 100 }
        case 'order':
        default:
            return { type: 'order', orders: [] }
    }
}