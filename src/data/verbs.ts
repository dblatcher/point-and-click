import { Verb } from "@/definitions";

export const verbs: Verb[] = [
    { id: 'WALK', label: 'walk to', isMoveVerb: true },
    { id: 'LOOK', label: 'look at', isLookVerb: true, defaultResponseNoItem: "I don't see anything special about it.", defaultResponseCannotReach: "I cannot see clearly from over here." },
    { id: 'TAKE', label: 'pick up', isNotForItems: true },
    { id: 'PUSH', label: 'push' },
    { id: 'USE', label: 'use', preposition: 'with', defaultResponseWithItem: "The $ITEM won't work on that." },
    { id: 'GIVE', label: 'give', preposition: 'to', defaultResponseWithItem: "They won't want this $ITEM.", defaultResponseCannotReach: "I cannot $VERB them the $ITEM from here." },
    { id: 'TALK', label: 'talk to', defaultResponseNoItem: "Talking to this $TARGET won't help." },
]
