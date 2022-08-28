import { Verb } from "../src/definitions/Verb";

export const verbs: Verb[] = [
    { id: 'LOOK', label: 'look at', defaultResponseNoItem: "I don't see anything special about it.", defaultResponseCannotReach: "I cannot see clearly from over here." },
    { id: 'TAKE', label: 'pick up' },
    { id: 'PUSH', label: 'push' },
    { id: 'USE', label: 'use', preposition: 'with', defaultResponseWithItem: "The $ITEM won't work on that." },
    { id: 'GIVE', label: 'give', preposition: 'to', defaultResponseWithItem: "They won't want this." },
    { id: 'TALK', label: 'talk to', defaultResponseNoItem: "Talking to this $TARGET won't help." },
]
