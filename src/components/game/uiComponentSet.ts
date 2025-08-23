import { ItemData, Verb } from "@/definitions";
import { FunctionComponent } from "react";
import { HandleHoverFunction } from "./types";


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
    save?: { (fileName?: string): void };
    deleteSave?: { (fileName: string): void }
    listSavedGames?: { (): string[] }
    load?: { (fileName?: string): void };
    isPaused: boolean;
    setIsPaused: { (isPaused: boolean): void };
}


export type UiComponentSet = {
    GameLayoutComponent?: FunctionComponent;
    title?: string
}