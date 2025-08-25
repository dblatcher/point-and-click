import { supportedHelpTopic, SupportedHelpTopic } from "@/components/GameEditor/HelpText";
import {
    ActorIcon, ConversationIcon, ExclamationIcon,
    DesignServicesIcon,
    IconComponent, ImageIcon, InteractionIcon,
    InventoryIcon, RoomIcon, SequenceIcon,
    SlideshowIcon, SoundIcon, SpriteIcon
} from "@/components/GameEditor/material-icons";
import { GameDataItemType, GameDataItemTypeEnum } from "@/definitions/Game";

export type NonItemEditorType = 'main' | 'images' | 'sounds' | 'interactions';
export type TabId = NonItemEditorType | GameDataItemType
export type EditorTab = {
    id: TabId,
    label?: string,
    itemType?: GameDataItemType,
    helpTopic?: SupportedHelpTopic
}

const validateItemType = (id: TabId): GameDataItemType | undefined => {
    const parse = GameDataItemTypeEnum.safeParse(id);
    return parse.success ? parse.data : undefined;
}

const buildTab = (id: TabId, label?: string): EditorTab => ({
    id,
    label,
    itemType: validateItemType(id),
    helpTopic: supportedHelpTopic.safeParse(id)?.data
})


export const tabIcons: Record<TabId, IconComponent | undefined> = {
    main: DesignServicesIcon,
    images: ImageIcon,
    sounds: SoundIcon,
    interactions: InteractionIcon,
    rooms: RoomIcon,
    items: InventoryIcon,
    actors: ActorIcon,
    conversations: ConversationIcon,
    sprites: SpriteIcon,
    sequences: SequenceIcon,
    verbs: ExclamationIcon,
    storyBoards: SlideshowIcon
}

export const tabOrder: EditorTab[] = [
    buildTab('main', 'overview'),
    buildTab('rooms'),
    buildTab('actors'),
    buildTab('items', 'Inventory Items',),
    buildTab('interactions'),
    buildTab('sequences',),
    buildTab('conversations'),
    buildTab('verbs',),
    buildTab('storyBoards', 'Story Boards'),
    buildTab('sprites'),
    buildTab('images', 'image assets',),
    buildTab('sounds', 'audio assets',),
]

export const DATA_TYPES_WITH_JSON: GameDataItemType[] = [
    'rooms', 'actors', 'conversations', 'sprites',
]