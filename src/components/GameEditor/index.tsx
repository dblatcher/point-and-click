import { TabSet } from "@/components/GameEditor/TabSet";
import { GameDesignProvider } from "@/context/game-design-context";
import { SpritesProvider } from "@/context/sprite-context";
import { prebuiltGameDesign } from '@/data/fullGame';
import { GameDataItem, GameDesign, Interaction, Verb } from "@/definitions";
import { FlagMap } from "@/definitions/Flag";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { findById, findIndexById, listIds } from "@/lib/util";
import imageService from "@/services/imageService";
import { populateServicesForPreBuiltGame } from "@/services/populateServices";
import { editorTheme } from "@/theme";
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import { Box, Container, Divider, IconButton, Stack, ThemeProvider } from "@mui/material";
import { Component } from "react";
import { ActorEditor } from "./ActorEditor";
import { ConversationEditor } from "./ConversationEditor";
import { EndingEditor } from "./EndingEditor";
import { ImageAssetTool } from "./ImageAssetTool";
import { InteractionEditor } from "./InteractionEditor";
import { ItemEditor } from "./ItemEditor";
import { OptionsMenu } from "./OptionsMenu";
import { Overview } from "./Overview";
import { RoomEditor } from "./RoomEditor";
import { testSprite } from "./RoomEditor/testSprite";
import { SaveLoadAndUndo } from "./SaveLoadAndUndo";
import { SequenceEditor } from "./SequenceEditor";
import { ConversationCreator } from "./ConversationCreator";
import { SoundAssetTool } from "./SoundAssetTool";
import { SpriteEditor } from "./SpriteEditor";
import { TestGameDialog } from "./TestGameDialog";
import { Entry, Folder, TreeMenu } from "./TreeMenu";
import { VerbEditor } from "./VerbEditor";
import { VerbMenuEditor } from "./VerbMenuEditor";
import { defaultVerbs1, getBlankRoom, makeBlankActor, makeBlankItem } from "./defaults";
import { DataItemCreator } from "./DataItemCreator";
import { ItemDataSchema } from "@/definitions/ItemData";
import { ActorDataSchema } from "@/definitions/ActorData";

export type EditorOptions = {
    autoSave: boolean;
}

type State = {
    gameDesign: GameDesign;
    tabOpen: number;
    gameItemIds: {
        rooms?: string;
        items?: string;
        actors?: string;
        conversations?: string;
        sprites?: string;
        sequences?: string;
        endings?: string;
        verbs?: string;
    };
    resetTimeStamp: number;

    options: EditorOptions;
    history: { gameDesign: GameDesign; label: string }[];
    undoTime: number;
    gameTestDialogOpen: boolean;
};

export type Props = {
    usePrebuiltGame?: boolean;
}

const tabs: string[] = [
    'main',
    'rooms',
    'items',
    'actors',
    'conversations',
    'sprites',
    'interactions',
    'sequences',
    'endings',
    'verbs',
    'images',
    'sounds',
]

const defaultRoomId = 'ROOM_1' as const;

function addNewOrUpdate<T extends GameDataItem>(newData: unknown, list: T[]): T[] {
    const newItem = newData as T;
    const matchIndex = findIndexById(newItem.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newItem)
    } else {
        list.push(newItem)
    }
    console.log({ matchIndex }, list)
    return list
}

export default class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)

        if (props.usePrebuiltGame) {
            populateServicesForPreBuiltGame()
        }

        const gameDesign = props.usePrebuiltGame ? { ...prebuiltGameDesign } : {
            id: "NEW_GAME",
            rooms: [Object.assign(getBlankRoom(), { id: defaultRoomId, height: 150 })],
            actors: [],
            interactions: [],
            items: [],
            conversations: [],
            verbs: defaultVerbs1(),
            currentRoomId: defaultRoomId,
            sequences: [],
            sprites: [],
            endings: [],
            flagMap: {},
        };


        this.state = {
            gameDesign,
            tabOpen: tabs.indexOf('main'),
            gameItemIds: {},
            resetTimeStamp: 0,
            options: {
                autoSave: true
            },
            history: [],
            undoTime: 0,
            gameTestDialogOpen: false,
        }

        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
        this.performUpdate = this.performUpdate.bind(this)
        this.changeInteraction = this.changeInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
        this.loadNewGame = this.loadNewGame.bind(this)
        this.provideSprite = this.provideSprite.bind(this)
        this.undo = this.undo.bind(this)
        this.openItemInEditor = this.openItemInEditor.bind(this)
    }

    respondToServiceUpdate(payload: unknown) {
        console.log('service update', { payload })
        this.forceUpdate()
    }

    componentDidMount() {
        imageService.on('update', this.respondToServiceUpdate)
    }

    componentWillUnmount() {
        imageService.off('update', this.respondToServiceUpdate)
    }

    provideSprite(id: string) {
        const spriteData = findById(id, this.state.gameDesign.sprites)

        if (!spriteData) {
            return undefined
        }

        return new Sprite(spriteData);
    }

    get currentRoom() {
        return findById(this.state.gameItemIds.rooms, this.state.gameDesign.rooms)
    }
    get currentItem() {
        return findById(this.state.gameItemIds.items, this.state.gameDesign.items)
    }
    get currentActor() {
        return findById(this.state.gameItemIds.actors, this.state.gameDesign.actors)
    }
    get currentConversation() {
        return findById(this.state.gameItemIds.conversations, this.state.gameDesign.conversations)
    }
    get currentSprite() {
        return findById(this.state.gameItemIds.sprites, this.state.gameDesign.sprites)
    }

    performUpdate(property: keyof GameDesign, data: unknown) {
        console.log(property, data)

        this.setState(state => {
            const { gameDesign, gameItemIds, history } = state
            history.push({
                label: `update ${property}`,
                gameDesign: cloneData(gameDesign)
            })
            if (history.length > 10) { history.shift() }
            switch (property) {
                case 'rooms':
                case 'items':
                case 'actors':
                case 'conversations':
                case 'sprites':
                case 'sequences':
                case 'endings':
                    {
                        addNewOrUpdate(data, gameDesign[property] as GameDataItem[])
                        gameItemIds[property] = (data as GameDataItem).id
                        break
                    }
                case 'verbs':
                    {
                        if (Array.isArray(data)) {
                            gameDesign[property] = data as Verb[]
                        } else {
                            addNewOrUpdate(data, gameDesign[property])
                            gameItemIds[property] = (data as GameDataItem).id
                        }
                        break
                    }
                case 'interactions':
                    {
                        if (Array.isArray(data)) {
                            gameDesign.interactions = data as Interaction[]
                        }
                        break
                    }
                case 'flagMap': {
                    gameDesign.flagMap = (data as FlagMap)
                    break
                }
                case 'id':
                case 'currentRoomId': {
                    gameDesign[property] = data as string
                    break
                }
                case 'openingSequenceId': {
                    if (data === '' || typeof data === 'undefined') {
                        gameDesign[property] = undefined
                    } else {
                        gameDesign[property] = data as string
                    }
                    break
                }
            }
            return { gameDesign, gameItemIds }
        })
    }

    deleteArrayItem(index: number, property: keyof GameDesign) {
        // TO DO - check for references to the ID of the deleted item?
        this.setState(state => {
            const { gameDesign, history } = state
            history.push({
                label: `delete ${property}`,
                gameDesign: cloneData(gameDesign)
            })
            if (Array.isArray(gameDesign[property])) {
                const [deletedItem] = (gameDesign[property] as GameDataItem[]).splice(index, 1)
            }
            return { gameDesign, history }
        })
    }
    changeInteraction(data: Interaction, index?: number) {
        this.setState(state => {
            const { gameDesign, history } = state
            history.push({
                label: `change interaction`,
                gameDesign: cloneData(gameDesign)
            })
            const { interactions } = gameDesign
            if (typeof index === 'undefined') {
                interactions.push(data)
            } else {
                interactions.splice(index, 1, data)
            }
            return { gameDesign, history }
        })
    }
    loadNewGame(gameDesign: GameDesign) {
        this.setState({ gameDesign })
    }
    undo() {
        this.setState(state => {
            const { history } = state
            const historyItem = history.pop()
            if (!historyItem) { return {} }
            return {
                ...state,
                history,
                gameDesign: historyItem.gameDesign,
                undoTime: Date.now()
            }
        })
    }

    openItemInEditor(itemType: keyof State['gameItemIds'], itemId: string | undefined) {
        this.setState(state => {
            const { gameItemIds } = state
            switch (itemType) {
                case 'rooms':
                case 'items':
                case 'actors':
                case 'conversations':
                case 'sprites':
                case 'sequences':
                case 'endings':
                case 'verbs':
                    gameItemIds[itemType] = itemId
                    break;
            }
            return { gameItemIds, tabOpen: tabs.indexOf(itemType) }
        })
    }

    render() {
        const {
            gameDesign, tabOpen, options, gameItemIds, history,
        } = this.state
        const { performUpdate, deleteArrayItem } = this

        const makeFolder = (id: string, list?: { id: string }[], entryId?: string): Folder => {
            const entries: Entry[] | undefined = list?.map(item => ({ data: item, active: entryId === item.id }))
            if (entries) {
                entries.push({
                    data: { id: '' },
                    active: !entryId,
                    label: '[add new]',
                    isForNew: true
                })
            }
            return {
                id, open: tabs[tabOpen] === id,
                entries
            }
        }

        const folders = [
            makeFolder('main'),
            makeFolder('rooms', gameDesign.rooms, gameItemIds.rooms),
            makeFolder('items', gameDesign.items, gameItemIds.items),
            makeFolder('actors', gameDesign.actors, gameItemIds.actors),
            makeFolder('conversations', gameDesign.conversations, gameItemIds.conversations),
            makeFolder('sprites', gameDesign.sprites, gameItemIds.sprites),
            makeFolder('interactions'),
            makeFolder('sequences', gameDesign.sequences, gameItemIds.sequences),
            makeFolder('endings', gameDesign.endings, gameItemIds.endings),
            makeFolder('verbs', gameDesign.verbs, gameItemIds.verbs),
            makeFolder('images'),
            makeFolder('sounds'),
        ]

        const sprites = [testSprite, ...gameDesign.sprites.map(data => new Sprite(data))]

        return (
            <ThemeProvider theme={editorTheme}>
                <GameDesignProvider value={{
                    gameDesign: this.state.gameDesign,
                    performUpdate,
                    deleteArrayItem,
                    options,
                }} >
                    <SpritesProvider value={sprites}>
                        <Container maxWidth='xl'
                            component={'main'}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}>
                            <Stack
                                direction={'row'}
                                spacing={1}
                                sx={{
                                    overflow: 'hidden',
                                }}
                                divider={<Divider orientation="vertical" flexItem />}
                            >
                                <Stack
                                    component={'nav'}
                                    spacing={1}
                                    width={250}
                                >
                                    <Stack direction={'row'} marginTop={3} spacing={3}>
                                        <SaveLoadAndUndo
                                            gameDesign={gameDesign}
                                            loadNewGame={this.loadNewGame}
                                            history={history}
                                            undo={this.undo}
                                        />
                                        <OptionsMenu options={this.state.options} setOptions={options => { this.setState({ options }) }} />

                                        <IconButton
                                            onClick={() => { this.setState({ gameTestDialogOpen: true, resetTimeStamp: Date.now() }) }}
                                        >
                                            <PlayCircleFilledOutlinedIcon />
                                        </IconButton>
                                    </Stack>
                                    <TreeMenu folders={folders}
                                        folderClick={(folderId) => {
                                            const folderIndex = tabs.indexOf(folderId);
                                            this.setState({
                                                tabOpen: folderIndex,
                                                gameItemIds: {},
                                            })
                                        }}
                                        entryClick={(folderId, data, isForNew) => {
                                            const newId: string | undefined = isForNew ? undefined : data.id;
                                            switch (folderId) {
                                                case 'rooms':
                                                case 'items':
                                                case 'actors':
                                                case 'conversations':
                                                case 'sprites':
                                                case 'sequences':
                                                case 'endings':
                                                case 'verbs':
                                                    this.openItemInEditor(folderId, newId)
                                            }
                                        }}
                                    />
                                </Stack>

                                <Box component={'section'} flex={1} sx={{ overflowY: 'auto' }}>
                                    <TabSet
                                        onlyRenderOpenTab
                                        fullHeight
                                        // ISSUE - re-rendering on undo clears the subcomponent state in TabMenus,
                                        // making the UI switch to the first horizontal tag
                                        // EG ActorEditor
                                        key={this.state.undoTime}
                                        openIndex={tabOpen} tabs={[
                                            {
                                                label: 'main', content: <Overview />
                                            },
                                            {
                                                label: 'Room Editor', content: <RoomEditor
                                                    updateData={data => { this.performUpdate('rooms', data) }}
                                                    deleteData={index => { this.deleteArrayItem(index, 'rooms') }}
                                                    existingRoomIds={listIds(gameDesign.rooms)}
                                                    actors={gameDesign.actors}
                                                    options={options}
                                                    key={gameItemIds.rooms} data={this.currentRoom} />
                                            },
                                            {
                                                label: 'Items',
                                                content:
                                                    <>
                                                        {this.currentItem ?
                                                            <ItemEditor key={gameItemIds.items}
                                                                item={this.currentItem}
                                                            />
                                                            : (
                                                                <DataItemCreator
                                                                    createBlank={makeBlankItem}
                                                                    schema={ItemDataSchema}
                                                                    designProperty="items"
                                                                    itemTypeName="inventory item"
                                                                    openInEditor={this.openItemInEditor}
                                                                />
                                                            )}
                                                    </>
                                            },
                                            {
                                                label: 'Actor Editor', content: this.currentActor
                                                    ? <ActorEditor
                                                        rooms={gameDesign.rooms}
                                                        updateData={data => { this.performUpdate('actors', data) }}
                                                        data={this.currentActor}
                                                        provideSprite={this.provideSprite}
                                                        spriteIds={listIds(gameDesign.sprites)}
                                                    />
                                                    : <DataItemCreator
                                                        createBlank={makeBlankActor}
                                                        schema={ActorDataSchema}
                                                        designProperty="actors"
                                                        itemTypeName="actor"
                                                        openInEditor={this.openItemInEditor}
                                                    />
                                            },
                                            {
                                                label: 'Conversation Editor', content: <>
                                                    {this.currentConversation ? (
                                                        <ConversationEditor key={gameItemIds.conversations}
                                                            conversation={this.currentConversation}
                                                        />
                                                    ) : (
                                                        <ConversationCreator
                                                            openInEditor={(newId) => {
                                                                this.openItemInEditor('conversations', newId)
                                                            }} />
                                                    )}
                                                </>
                                            },
                                            {
                                                label: 'Sprite Editor', content: <SpriteEditor
                                                    updateData={data => { this.performUpdate('sprites', data) }}
                                                    deleteData={index => { this.deleteArrayItem(index, 'sprites') }}
                                                    key={gameItemIds.sprites} data={this.currentSprite}
                                                    options={options}
                                                    provideSprite={this.provideSprite}
                                                    spriteIds={listIds(gameDesign.sprites)}
                                                />
                                            },
                                            {
                                                label: 'interactions', content: <InteractionEditor
                                                    changeInteraction={this.changeInteraction}
                                                    deleteInteraction={(index: number) => { this.deleteArrayItem(index, 'interactions') }}
                                                    updateData={data => { this.performUpdate('interactions', data) }}
                                                    gameDesign={gameDesign} />
                                            },
                                            {
                                                label: 'Sequences', content: <SequenceEditor
                                                    key={gameItemIds.sequences}
                                                    gameDesign={gameDesign}
                                                    data={findById(gameItemIds.sequences, gameDesign.sequences)}
                                                    updateData={data => { this.performUpdate('sequences', data) }}
                                                    deleteData={index => { this.deleteArrayItem(index, 'sequences') }}
                                                    options={options}
                                                    sequenceId={gameItemIds.sequences} />
                                            },
                                            {
                                                label: 'endings', content: (
                                                    <EndingEditor key={gameItemIds.endings}
                                                        data={findById(gameItemIds.endings, gameDesign.endings)}
                                                    />)
                                            },
                                            {
                                                label: 'verbs', content: <>
                                                    <VerbEditor key={gameItemIds.verbs}
                                                        data={findById(gameItemIds.verbs, gameDesign.verbs)}
                                                    />
                                                    <br />
                                                    <VerbMenuEditor />
                                                </>
                                            },
                                            { label: 'Image uploader', content: <ImageAssetTool /> },
                                            { label: 'Sound uploader', content: <SoundAssetTool /> },
                                        ]} />
                                </Box>
                            </Stack>

                            <TestGameDialog
                                isOpen={this.state.gameTestDialogOpen}
                                close={() => { this.setState({ gameTestDialogOpen: false }) }}
                                reset={() => { this.setState({ resetTimeStamp: Date.now() }) }}
                                resetTimeStamp={this.state.resetTimeStamp}
                            />

                        </Container>
                    </SpritesProvider>
                </GameDesignProvider>
            </ThemeProvider>
        )
    }
}
