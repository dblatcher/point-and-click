import { Verb, ItemData, CommandTarget } from "@/oldsrc";
import { FunctionComponent } from "react";
import { HandleHoverFunction } from ".";

export type CommandLineComponent = FunctionComponent<{
    verb?: Verb;
    item?: ItemData;
    target?: CommandTarget;
    hoverTarget?: CommandTarget;
}>
export type VerbMenuComponent = FunctionComponent<{
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}>
export type ItemMenuComponent = FunctionComponent<{
    items: ItemData[];
    currentItemId?: string;
    select: { (item: ItemData): void };
    handleHover?: HandleHoverFunction;
}>
export type SaveMenuComponent = FunctionComponent<{
    save?: { (): void };
    reset?: { (): void };
    load?: { (): void };
}>

export type UiComponentSet = {
    CommandLineComponent?: CommandLineComponent;
    VerbMenuComponent?: VerbMenuComponent
    ItemMenuComponent?: ItemMenuComponent;
    SaveMenuComponent?: SaveMenuComponent;
}