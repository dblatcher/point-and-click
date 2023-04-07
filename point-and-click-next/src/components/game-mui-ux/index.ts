import { UiComponentSet } from "../game/uiComponentSet";
import { CommandLine } from "./CommandLine";
import { ConversationMenu } from "./ConversationMenu";
import { ItemMenu } from "./ItemMenu";
import { Layout } from "./Layout";
import { SaveMenu } from "./SaveMenu";
import { SoundToggle } from "./SoundToggle";
import { VerbMenu } from "./VerbMenu";

export const materialUiComponents: UiComponentSet = {
    CommandLineComponent: CommandLine,
    VerbMenuComponent: VerbMenu,
    ItemMenuComponent: ItemMenu,
    SaveMenuComponent: SaveMenu,
    ConversationMenuComponent: ConversationMenu,
    SoundToggleComponent: SoundToggle,
    GameLayoutComponent: Layout,
}