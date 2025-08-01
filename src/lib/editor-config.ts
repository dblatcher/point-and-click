import { GameDataItemType, GameDataItemTypeEnum } from "@/definitions/Game";

export type NonItemEditorType = 'main' | 'images' | 'sounds' | 'interactions';
export type TabId = NonItemEditorType | GameDataItemType
export type EditorTab = { id: TabId, label: string, itemType?: GameDataItemType, helpTopic?: string }

const validateItemType = (id: TabId): GameDataItemType | undefined => {
    const parse = GameDataItemTypeEnum.safeParse(id);
    return parse.success ? parse.data : undefined;
}

const buildTab = (id: TabId, label?: string): EditorTab => ({
    id,
    label: label ?? id,
    itemType: validateItemType(id),
    helpTopic: [
        'items', 'rooms', 'verb menu', 'actors'
    ].includes(id) ? id : undefined
})

export const tabOrder: EditorTab[] = [
    buildTab('main', 'overview'),
    buildTab('rooms'),
    buildTab('sprites'),
    buildTab('actors'),
    buildTab('items', 'Inventory Items'),
    buildTab('conversations'),
    buildTab('sequences'),
    buildTab('verbs'),
    buildTab('interactions'),
    buildTab('images', 'image assets'),
    buildTab('sounds', 'audio assets'),
    buildTab('storyBoards', 'Story Boards')
]

export const DATA_TYPES_WITH_JSON: GameDataItemType[] = [
    'rooms', 'actors', 'conversations', 'sprites',
]