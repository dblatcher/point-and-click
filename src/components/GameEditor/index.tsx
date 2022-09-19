/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";

import { TreeMenu, Folder, Entry } from "./TreeMenu";
import { Overview } from "./Overview";
import { SpriteSheetTool } from "./SpriteSheetEditor";
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
import { GameDesign, GameDataItem, Interaction, Ending, Verb } from "src";
import { FlagMap } from "src/definitions/Flag";

import { populateServicesForPreBuiltGame } from "../../services/populateServices";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";
import spriteSheetService from "../../services/spriteSheetService";

import layoutStyles from "./editorLayoutStyles.module.css";
import { CheckBoxInput } from "./formControls";


const usePrebuiltGame = false
if (usePrebuiltGame) {
    populateServicesForPreBuiltGame()
}

export type EditorOptions = {
    autoSave: boolean;
}

type State = {
    gameDesign: GameDesign;
    tabOpen: number;
    roomId?: string;
    itemId?: string;
    actorId?: string;
    conversationId?: string;
    spriteId?: string;
    spriteSheetId?: string;
    sequenceId?: string;
    endingId?: string;
    verbId?: string;

    resetTimeStamp: number;

    options: EditorOptions;
};

type Props = {

}

const tabs: string[] = [
    'main',
    'rooms',
    'items',
    'actors',
    'conversations',
    'sprites',
    'spriteSheets',
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
        const gameDesign = usePrebuiltGame ? { ...prebuiltGameDesign } : {
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
            spriteSheets: [],
            endings: [],
            flagMap: {},
        };


        this.state = {
            gameDesign,
            tabOpen: tabs.indexOf('main'),
            resetTimeStamp: 0,
            options: {
                autoSave: true
            },
        }

        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
        this.performUpdate = this.performUpdate.bind(this)
        this.changeInteraction = this.changeInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
        this.loadNewGame = this.loadNewGame.bind(this)
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
        return findById(this.state.roomId, this.state.gameDesign.rooms)
    }
    get currentItem() {
        return findById(this.state.itemId, this.state.gameDesign.items)
    }
    get currentActor() {
        return findById(this.state.actorId, this.state.gameDesign.actors)
    }
    get currentConversation() {
        return findById(this.state.conversationId, this.state.gameDesign.conversations)
    }
    get currentSprite() {
        return findById(this.state.spriteId, this.state.gameDesign.sprites)
    }
    get currentSpriteSheet() {
        return findById(this.state.spriteSheetId, this.state.gameDesign.spriteSheets)
    }

    performUpdate(property: keyof GameDesign, data: unknown) {
        console.log(property, data)

        this.setState(state => {
            const { gameDesign } = state
            let { roomId, itemId, actorId, spriteId, spriteSheetId, sequenceId, endingId, verbId, } = state
            switch (property) {
                case 'rooms': {
                    addNewOrUpdate(data, gameDesign[property])
                    roomId = (data as GameDataItem).id
                    break
                }
                case 'items': {
                    addNewOrUpdate(data, gameDesign[property])
                    itemId = (data as GameDataItem).id
                    break
                }
                case 'actors': {
                    addNewOrUpdate(data, gameDesign[property])
                    actorId = (data as GameDataItem).id
                    break
                }
                case 'conversations': {
                    console.log('CONV', data)
                    addNewOrUpdate(data, gameDesign[property])
                    actorId = (data as GameDataItem).id
                    break
                }
                case 'sprites': {
                    addNewOrUpdate(data, gameDesign[property])
                    spriteId = (data as GameDataItem).id
                    break
                }
                case 'spriteSheets': {
                    addNewOrUpdate(data, gameDesign[property])
                    spriteSheetId = (data as GameDataItem).id
                    break
                }
                case 'sequences': {
                    addNewOrUpdate(data, gameDesign[property])
                    sequenceId = (data as GameDataItem).id
                    break
                }
                case 'endings': {
                    addNewOrUpdate(data, gameDesign[property])
                    endingId = (data as Ending).id
                    break
                }
                case 'verbs': {
                    addNewOrUpdate(data, gameDesign[property])
                    verbId = (data as Verb).id
                    break
                }
                case 'flagMap': {
                    console.log('FLAGMAP', data)
                    gameDesign.flagMap = (data as FlagMap)
                    break
                }
                case 'id':
                case 'currentRoomId': {
                    gameDesign[property] = data as string
                    break
                }
                case 'openingSequenceId': {
                    console.log('openingSequenceId data', typeof data, data)
                    if (data === '' || typeof data === 'undefined') {
                        gameDesign[property] = undefined
                    } else {
                        gameDesign[property] = data as string
                    }
                    break
                }
            }
            return { gameDesign, roomId, itemId, actorId, spriteId, spriteSheetId, sequenceId, endingId, verbId }
        })
    }

    deleteArrayItem(index: number, property: keyof GameDesign) {
        // TO DO - check for references to the ID of the deleted item?
        this.setState(state => {
            const { gameDesign } = state
            if (Array.isArray(gameDesign[property])) {
                const [deletedItem] = (gameDesign[property] as GameDataItem[]).splice(index, 1)
                if (property === 'sprites' && 'id' in deletedItem) {
                    spriteService.remove(deletedItem.id)
                }
                if (property === 'spriteSheets' && 'id' in deletedItem) {
                    spriteSheetService.remove(deletedItem.id)
                }
            }
            return { gameDesign }
        })
    }
    changeInteraction(data: Interaction, index?: number) {
        this.setState(state => {
            const { gameDesign } = state
            const { interactions } = gameDesign
            if (typeof index === 'undefined') {
                interactions.push(data)
            } else {
                interactions.splice(index, 1, data)
            }
            return { gameDesign }
        })
    }
    loadNewGame(gameDesign: GameDesign) {
        this.setState({ gameDesign })
        spriteSheetService.add(gameDesign.spriteSheets)
    }

    get noOpenItemsState(): Partial<State> {
        return {
            roomId: undefined,
            itemId: undefined,
            actorId: undefined,
            spriteId: undefined,
            spriteSheetId: undefined,
            conversationId: undefined,
            sequenceId: undefined,
            endingId: undefined,
            verbId: undefined,
        }
    }

    render() {
        const {
            gameDesign, tabOpen, options,
            roomId, itemId, actorId, spriteId, spriteSheetId, conversationId, sequenceId, endingId, verbId
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
            makeFolder('rooms', gameDesign.rooms, roomId),
            makeFolder('items', gameDesign.items, itemId),
            makeFolder('actors', gameDesign.actors, actorId),
            makeFolder('conversations', gameDesign.conversations, conversationId),
            makeFolder('sprites', gameDesign.sprites, spriteId),
            makeFolder('spriteSheets', gameDesign.spriteSheets, spriteSheetId),
            makeFolder('interactions'),
            makeFolder('sequences', gameDesign.sequences, sequenceId),
            makeFolder('endings', gameDesign.endings, endingId),
            makeFolder('verbs', gameDesign.verbs, verbId),
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

                <TreeMenu folders={folders}
                    folderClick={(folderId) => {
                        const folderIndex = tabs.indexOf(folderId);
                        this.setState({ tabOpen: folderIndex, ...this.noOpenItemsState })
                    }}
                    entryClick={(folderId, data, isForNew) => {
                        const folderIndex = tabs.indexOf(folderId);
                        const modification: Partial<State> = { tabOpen: folderIndex }
                        const newId = isForNew ? undefined : data.id;

                        switch (folderId) {
                            case 'rooms':
                                modification.roomId = newId
                                break;
                            case 'items':
                                modification.itemId = newId
                                break;
                            case 'actors':
                                modification.actorId = newId
                                break;
                            case 'conversations':
                                modification.conversationId = newId
                                break;
                            case 'sprites':
                                modification.spriteId = newId
                                break;
                            case 'spriteSheets':
                                modification.spriteSheetId = newId
                                break;
                            case 'sequences':
                                modification.sequenceId = newId
                                break;
                            case 'endings':
                                modification.endingId = newId
                                break;
                            case 'verbs':
                                modification.verbId = newId
                                break;
                        }
                        this.setState(modification)
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
                <TabMenu backgroundColor="none" noButtons defaultOpenIndex={tabOpen} tabs={[
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
                            key={roomId} data={this.currentRoom} />
                    },
                    {
                        label: 'Items', content: <ItemEditor
                            updateData={data => { this.performUpdate('items', data) }}
                            deleteData={index => { this.deleteArrayItem(index, 'items') }}
                            itemIds={listIds(gameDesign.items)}
                            actorIds={listIds(gameDesign.actors)}
                            options={options}
                            key={itemId} data={this.currentItem}
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
                            key={actorId} data={this.currentActor}
                        />
                    },
                    {
                        label: 'Conversation Editor', content: <ConversationEditor
                            sequenceIds={listIds(gameDesign.sequences)}
                            conversations={gameDesign.conversations}
                            updateData={data => { this.performUpdate('conversations', data) }}
                            deleteData={index => { this.deleteArrayItem(index, 'conversations') }}
                            options={options}
                            key={conversationId} data={this.currentConversation}
                        />
                    },
                    {
                        label: 'Sprite Editor', content: <SpriteEditor
                            updateData={data => { this.performUpdate('sprites', data) }}
                            deleteData={index => { this.deleteArrayItem(index, 'sprites') }}
                            key={spriteId} data={this.currentSprite}
                            options={options}
                            spriteIds={listIds(gameDesign.sprites)}
                        />
                    },
                    {
                        label: 'Sprite Sheets', content: <SpriteSheetTool
                            updateData={data => { this.performUpdate('spriteSheets', data) }}
                            deleteData={index => { this.deleteArrayItem(index, 'spriteSheets') }}
                            key={spriteSheetId} data={this.currentSpriteSheet}
                            options={options}
                            spriteSheetIds={listIds(gameDesign.spriteSheets)}
                        />
                    },
                    {
                        label: 'interactions', content: <InteractionEditor
                            changeInteraction={this.changeInteraction}
                            deleteInteraction={(index: number) => { this.deleteArrayItem(index, 'interactions') }}
                            gameDesign={gameDesign} />
                    },
                    {
                        label: 'Sequences', content: <SequenceEditor
                            key={sequenceId}
                            gameDesign={gameDesign}
                            data={findById(sequenceId, gameDesign.sequences)}
                            updateData={data => { this.performUpdate('sequences', data) }}
                            deleteData={index => { this.deleteArrayItem(index, 'sequences') }}
                            options={options}
                            sequenceId={sequenceId} />
                    },
                    {
                        label: 'endings', content: <EndingEditor
                            key={endingId}
                            gameDesign={gameDesign}
                            data={findById(endingId, gameDesign.endings)}
                            updateData={data => { this.performUpdate('endings', data) }}
                            deleteData={index => { this.deleteArrayItem(index, 'endings') }}
                            options={options}
                        />
                    },
                    {
                        label: 'verbs', content: <VerbEditor
                            key={verbId}
                            gameDesign={gameDesign}
                            data={findById(verbId, gameDesign.verbs)}
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
                                <Game key={this.state.resetTimeStamp}
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
