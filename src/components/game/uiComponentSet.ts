import { Verb, ItemData, ConversationChoice } from "@/definitions";
import { FunctionComponent, ReactNode } from "react";
import { HandleHoverFunction } from ".";


export type VerbMenuProps = {
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}
export const verbMenuPropsAreEqual = (prevProps: VerbMenuProps, nextProps: VerbMenuProps): boolean => {
    return prevProps.currentVerbId === nextProps.currentVerbId
}

export type ItemMenuProps = {
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}
const itemsToIdString = (items: ItemData[]): string => items.map(item => item.id).join()
export const itemMenuPropsAreEqual = (prevProps: ItemMenuProps, nextProps: ItemMenuProps): boolean => {
    return prevProps.currentItemId === nextProps.currentItemId && itemsToIdString(prevProps.items) === itemsToIdString(nextProps.items)
}

export type SaveMenuProps = {
    save?: { (): void };
    reset?: { (): void };
    load?: { (): void };
    isPaused: boolean;
    setIsPaused: { (isPaused: boolean): void };
}

export type GameLayoutProps = {
    children: ReactNode;
    saveMenu: ReactNode;
    selectVerb: { (verb: Verb): void };
    selectConversation: { (choice: ConversationChoice): void };
    selectItem: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}

export type UiComponentSet = {
    SaveMenuComponent?: FunctionComponent<SaveMenuProps>;
    GameLayoutComponent?: FunctionComponent<GameLayoutProps>;
}