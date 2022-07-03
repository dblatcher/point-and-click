
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
    text: string;
    sequence: Sequence;
    nextBranch?: string;
    end?: boolean;
}
