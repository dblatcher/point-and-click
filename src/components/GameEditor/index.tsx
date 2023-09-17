import { Component } from "react";

import { TreeMenu, Folder, Entry } from "./TreeMenu";
import { Overview } from "./Overview";
import { RoomEditor } from "./RoomEditor";
import { SpriteEditor } from "./SpriteEditor";
import { TabSet } from "@/components/GameEditor/TabSet";
import { ActorEditor } from "./ActorEditor";
import { ImageAssetTool } from "./ImageAssetTool";
import { ItemEditor } from "./ItemEditor";
import { InteractionEditor } from "./InteractionEditor";
import { ConversationEditor } from "./ConversationEditor";
import { SequenceEditor } from "./SequenceEditor";
import { SaveLoadAndUndo } from "./SaveLoadAndUndo";
import { SoundAssetTool } from "./SoundAssetTool";
import { EndingEditor } from "./EndingEditor";
import { VerbEditor } from "./VerbEditor";
import Game from "@/components/game";

import { defaultVerbs1, getBlankRoom } from "./defaults";

import { prebuiltGameDesign } from '@/data/fullGame';
import { listIds, findById, findIndexById } from "@/lib/util";
import { cloneData } from "@/lib/clone";
import { GameDesign, GameDataItem, Interaction, Verb } from "@/definitions";
import { FlagMap } from "@/definitions/Flag";

import { populateServicesForPreBuiltGame } from "@/services/populateServices";
import imageService from "@/services/imageService";
import spriteService from "@/services/spriteService";

import { VerbMenuEditor } from "./VerbMenuEditor";
import { Container, Stack, Box, Typography, Divider } from "@mui/material";
import { OptionsMenu } from "./OptionsMenu";
import { GameDesignProvider } from "./game-design-context";
import { Sprite } from "@/lib/Sprite";
import { SpritesProvider } from "@/context/sprite-context";


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
    'test',
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
        }

        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
        this.performUpdate = this.performUpdate.bind(this)
        this.changeInteraction = this.changeInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
        this.loadNewGame = this.loadNewGame.bind(this)
        this.provideSprite = this.provideSprite.bind(this)
        this.undo = this.undo.bind(this)
    }

    respondToServiceUpdate(payload: unknown) {
        console.log('service update', { payload })
        this.forceUpdate()
    }

    componentDidMount() {
        imageService.on('update', this.respondToServiceUpdate)
        spriteService.on('update', this.respondToServiceUpdate)
    }

    componentWillUnmount() {
        imageService.off('update', this.respondToServiceUpdate)
        spriteService.off('update', this.respondToServiceUpdate)
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
                if (property === 'sprites' && 'id' in deletedItem) {
                    spriteService.remove(deletedItem.id)
                }
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
                history,
                gameDesign: historyItem.gameDesign,
                undoTime: Date.now()
            }
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
            makeFolder('test'),
        ]

        const sprites = gameDesign.sprites.map(data => new Sprite(data))

        return (
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
                                <Stack direction={'row'}>
                                    <SaveLoadAndUndo
                                        gameDesign={gameDesign}
                                        loadNewGame={this.loadNewGame}
                                        history={history}
                                        undo={this.undo}
                                    />
                                    <OptionsMenu options={this.state.options} setOptions={options => { this.setState({ options }) }} />
                                </Stack>

                                <Typography variant="h2" noWrap gutterBottom sx={{ fontSize: '175%', paddingTop: 1, flexShrink: 0 }}>
                                    {gameDesign.id}
                                </Typography>

                                <TreeMenu folders={folders}
                                    folderClick={(folderId) => {
                                        const folderIndex = tabs.indexOf(folderId);
                                        this.setState(state => {
                                            return {
                                                tabOpen: folderIndex,
                                                gameItemIds: {},
                                                resetTimeStamp: folderId == 'test' ? Date.now() : state.resetTimeStamp
                                            }
                                        })
                                    }}
                                    entryClick={(folderId, data, isForNew) => {
                                        const folderIndex = tabs.indexOf(folderId);
                                        const newId: string | undefined = isForNew ? undefined : data.id;

                                        this.setState(state => {
                                            const { gameItemIds } = state
                                            switch (folderId) {
                                                case 'rooms':
                                                case 'items':
                                                case 'actors':
                                                case 'conversations':
                                                case 'sprites':
                                                case 'sequences':
                                                case 'endings':
                                                case 'verbs':
                                                    gameItemIds[folderId] = newId
                                                    break;
                                            }
                                            return { gameItemIds, tabOpen: folderIndex }
                                        })
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
                                            label: 'Items', content: <ItemEditor
                                                updateData={data => { this.performUpdate('items', data) }}
                                                deleteData={index => { this.deleteArrayItem(index, 'items') }}
                                                itemIds={listIds(gameDesign.items)}
                                                actorIds={listIds(gameDesign.actors)}
                                                options={options}
                                                key={gameItemIds.items} data={this.currentItem}
                                            />
                                        },
                                        {
                                            label: 'Actor Editor', content: <ActorEditor
                                                rooms={gameDesign.rooms}
                                                actors={gameDesign.actors}
                                                actorIds={listIds(gameDesign.actors)}
                                                updateData={data => { this.performUpdate('actors', data) }}
                                                deleteData={index => { this.deleteArrayItem(index, 'actors') }}
                                                options={options}
                                                key={gameItemIds.actors} data={this.currentActor}
                                                provideSprite={this.provideSprite}
                                                spriteIds={listIds(gameDesign.sprites)}
                                            />
                                        },
                                        {
                                            label: 'Conversation Editor', content: <ConversationEditor
                                                sequenceIds={listIds(gameDesign.sequences)}
                                                conversations={gameDesign.conversations}
                                                gameDesign={gameDesign}
                                                updateData={data => { this.performUpdate('conversations', data) }}
                                                deleteData={index => { this.deleteArrayItem(index, 'conversations') }}
                                                updateSequenceData={data => { this.performUpdate('sequences', data) }}
                                                options={options}
                                                key={gameItemIds.conversations} data={this.currentConversation}
                                            />
                                        },
                                        {
                                            label: 'Sprite Editor', content: <SpriteEditor
                                                updateData={data => { this.performUpdate('sprites', data) }}
                                                deleteData={index => { this.deleteArrayItem(index, 'sprites') }}
                                                key={gameItemIds.sprites} data={this.currentSprite}
                                                options={options}
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
                                            label: 'endings', content: <EndingEditor
                                                key={gameItemIds.endings}
                                                gameDesign={gameDesign}
                                                data={findById(gameItemIds.endings, gameDesign.endings)}
                                                updateData={data => { this.performUpdate('endings', data) }}
                                                deleteData={index => { this.deleteArrayItem(index, 'endings') }}
                                                options={options}
                                            />
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
                                        {
                                            label: 'Test', content: (
                                                <div>
                                                    <button onClick={() => { this.setState({ resetTimeStamp: Date.now() }) }} >reset game test</button>
                                                    <hr />
                                                    <Game
                                                        key={this.state.resetTimeStamp} startPaused
                                                        {...gameDesign} actorOrders={{}} gameNotBegun
                                                        showDebugLog={true}
                                                        _sprites={sprites}
                                                    />
                                                </div>
                                            )
                                        }
                                    ]} />
                            </Box>
                        </Stack>
                    </Container>
                </SpritesProvider>
            </GameDesignProvider>
        )
    }
}
