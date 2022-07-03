
import { Sequence } from "./Sequence";

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
    sequence: Sequence;
    nextBranch?: string;
    once?: boolean;
    disabled?: boolean;
    end?: boolean;
}
