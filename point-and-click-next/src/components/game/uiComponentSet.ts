import { Verb, ItemData, CommandTarget, Conversation, ConversationChoice } from "@/oldsrc";
import { FunctionComponent } from "react";
import { HandleHoverFunction } from ".";

export type CommandLineProps ={
    verb?: Verb;
    item?: ItemData;
    target?: CommandTarget;
    hoverTarget?: CommandTarget;
}
export type VerbMenuProps = {
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}
export type ItemMenuProps = {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}
export type SaveMenuProps = {
    save?: { (): void };
    reset?: { (): void };
    load?: { (): void };
}
export type ConversationMenuProps = {
    conversation: Conversation;
    select: { (choice: ConversationChoice): void };
}

export type UiComponentSet = {
    CommandLineComponent?: FunctionComponent<CommandLineProps>;
    VerbMenuComponent?: FunctionComponent<VerbMenuProps>;
    ItemMenuComponent?: FunctionComponent<ItemMenuProps>;
    SaveMenuComponent?: FunctionComponent<SaveMenuProps>;
    ConversationMenuComponent?: FunctionComponent<ConversationMenuProps>;
}