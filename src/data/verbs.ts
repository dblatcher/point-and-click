import { Verb } from "@/definitions";

export const detailedVerbSet: Verb[] = [
    { id: 'WALK', label: 'walk to', isMoveVerb: true },
    { id: 'LOOK', label: 'look at', isLookVerb: true, defaultResponseNoItem: "I don't see anything special about it.", defaultResponseCannotReach: "I cannot see clearly from over here." },
    { id: 'TAKE', label: 'pick up', isNotForItems: true },
    { id: 'PUSH', label: 'push', defaultResponseNoItem: "I can't move it." },
    { id: 'USE', label: 'use', preposition: 'with', defaultResponseWithItem: "The $ITEM won't work on that." },
    { id: 'GIVE', label: 'give', isNotForItems: true, requiresItem: true, preposition: 'to', defaultResponseWithItem: "They won't want this $ITEM.", defaultResponseCannotReach: "I cannot $VERB them the $ITEM from here." },
    { id: 'TALK', label: 'talk to', defaultResponseNoItem: "Talking to this $TARGET won't help." },
]

export const minimalVerbSet: Verb[] = [
    { id: 'WALK', label: 'walk to', isMoveVerb: true },
    { id: 'LOOK', label: 'look at', isLookVerb: true, defaultResponseNoItem: "I don't see anything special about it.", defaultResponseCannotReach: "I cannot see clearly from over here." },
    { id: 'USE', label: 'use', preposition: 'with', defaultResponseNoItem: "I can't do anything with $TARGET.", defaultResponseWithItem: "The $ITEM won't work on that." },
]
