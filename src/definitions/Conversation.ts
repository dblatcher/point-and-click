export type Conversation = {
    id: string;
    branches: Record<string, ConversationBranch | undefined>;
    currentBranch?: string;
    defaultBrach: string;
}

export type ConversationBranch = {
    choices: ConversationChoice[];
}

export type ConversationChoice = {
    ref?: string;
    text: string;
    sequence: string;
    nextBranch?: string;
    once?: boolean;
    disabled?: boolean;
    enablesChoices?: (string | undefined)[][];
    disablesChoices?: (string | undefined)[][];
    end?: boolean;
}
