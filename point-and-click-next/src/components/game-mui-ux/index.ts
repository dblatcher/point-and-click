import { UiComponentSet } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { ItemMenu } from "./ItemMenu";
import { RoomWrapper } from "./RoomWrapper";
import { SaveMenu } from "./SaveMenu";
import { VerbMenu } from "./VerbMenu";

export const materialUiComponents: UiComponentSet = {
    CommandLineComponent: CommandLine,
    VerbMenuComponent: VerbMenu,
    ItemMenuComponent: ItemMenu,
    SaveMenuComponent: SaveMenu,
    ConversationMenuComponent: ConversationMenu,
    RoomWrapperComponent: RoomWrapper,
}