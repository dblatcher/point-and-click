import { UiComponentSet } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ItemMenu } from "./ItemMenu";
import { SaveMenu } from "./SaveMenu";
import { VerbMenu } from "./VerbMenu";

export const materialUiComponents: UiComponentSet = {
    CommandLineComponent: CommandLine,
    VerbMenuComponent: VerbMenu,
    ItemMenuComponent: ItemMenu,
    SaveMenuComponent: SaveMenu,
}