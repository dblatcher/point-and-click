/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";

import { TreeMenu, Folder, Entry } from "./TreeMenu";
import { Overview } from "./Overview";
import { RoomEditor } from "./RoomEditor";
import { SpriteEditor } from "./SpriteEditor";
import { TabMenu } from "../TabMenu";
import { ActorEditor } from "./ActorEditor";
import { ImageAssetTool } from "./ImageAssetTool";
import { ItemEditor } from "./itemEditor";
import { InteractionEditor } from "./InteractionEditor";
import { ConversationEditor } from "./ConversationEditor";
import { SequenceEditor } from "./SequenceEditor";
import { GameDesignSaveAndLoad } from "./GameDesignSaveAndLoad";
import { SoundAssetTool } from "./SoundAssetTool";
import { EndingEditor } from "./EndingEditor";
import { VerbEditor } from "./VerbEditor";
import Game from "../Game";

import { defaultVerbs1, getBlankRoom } from "./defaults";

import { prebuiltGameDesign } from '../../../data/fullGame';
import { listIds, findById, findIndexById } from "../../lib/util";
import { cloneData } from "../../lib/clone";
import { GameDesign, GameDataItem, Interaction, Verb } from "src";
import { FlagMap } from "src/definitions/Flag";

import { populateServicesForPreBuiltGame } from "../../services/populateServices";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";

import layoutStyles from "./editorLayoutStyles.module.css";
import { CheckBoxInput } from "./formControls";


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

type Props = {
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

export class GameEditor extends Component<Props, State>{

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

        const makeFolder = (id: string, list?: { id: string }[], entryId?: string): Folder => {
            const entries: Entry[] | undefined = list?.map(item => ({ data: item, active: entryId === item.id }))
            if (entries) {

                entries.push({
                    data: { id: '' },
                    active: !entryId,
                    label: `➕ NEW`,
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

        return <main className={layoutStyles.main}>

            <nav className={layoutStyles.leftNav}>
                <h2>{gameDesign.id}</h2>

                <GameDesignSaveAndLoad
                    gameDesign={gameDesign}
                    loadNewGame={this.loadNewGame}
                />
                <hr />
                <div>
                    <button
                        onClick={this.undo}
                        disabled={history.length === 0}
                    >
                        UNDO {history[history.length-1]?.label} [{history.length}]
                    </button>
                </div>
                <hr />

                <TreeMenu folders={folders}
                    folderClick={(folderId) => {
                        const folderIndex = tabs.indexOf(folderId);
                        this.setState({ tabOpen: folderIndex, gameItemIds: {} })
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

                <hr />

                <div>
                    <button onClick={() => this.setState({ tabOpen: tabs.indexOf("test"), resetTimeStamp: Date.now() })}>Test Game</button>
                </div>

                <hr />
                <div>
                    <h3>options</h3>

                    <div>
                        <CheckBoxInput
                            label="autosave"
                            value={this.state.options.autoSave}
                            inputHandler={value => this.setState(state => {
                                const { options } = state
                                options.autoSave = value
                                return { options }
                            })}
                        />
                        {this.state.options.autoSave.toString()}
                    </div>
                </div>
            </nav>
            <section className={layoutStyles.tabMenuHolder}>
                <TabMenu backgroundColor="none"
                    key={this.state.undoTime}
                    noButtons defaultOpenIndex={tabOpen} tabs={[
                        {
                            label: 'main', content: <Overview
                                gameDesign={gameDesign}
                                edit={(property, value) => { this.performUpdate(property, value) }} />
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
                            label: 'verbs', content: <VerbEditor
                                key={gameItemIds.verbs}
                                gameDesign={gameDesign}
                                data={findById(gameItemIds.verbs, gameDesign.verbs)}
                                updateData={data => { this.performUpdate('verbs', data) }}
                                deleteData={index => { this.deleteArrayItem(index, 'verbs') }}
                                options={options}
                            />
                        },
                        { label: 'Image uploader', content: <ImageAssetTool /> },
                        { label: 'Sound uploader', content: <SoundAssetTool /> },
                        {
                            label: 'Test', content: (
                                <div>
                                    <button onClick={() => { this.setState({ resetTimeStamp: Date.now() }) }} >reset game test</button>
                                    <hr />
                                    <Game key={this.state.resetTimeStamp} startPaused
                                        {...gameDesign} actorOrders={{}} gameNotBegun
                                        showDebugLog={true} />
                                </div>
                            )
                        }
                    ]} />
            </section>
        </main >
    }
}
