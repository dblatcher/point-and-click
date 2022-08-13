/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";

import { TreeMenu, Folder, Entry } from "./TreeMenu";
import { Overview } from "./Overview";
import { SpriteSheetTool } from "./SpriteSheetTool";
import { RoomEditor } from "./RoomEditor";
import { SpriteEditor } from "./SpriteEditor";
import { TabMenu } from "../TabMenu";
import { CharacterEditor } from "./CharacterEditor";
import { ImageAssetTool } from "./ImageAssetTool";
import { ItemEditor } from "./itemEditor";
import { InteractionEditor } from "./InteractionEditor";
import { ConversationEditor } from "./ConversationEditor";

import { defaultVerbs1, getBlankRoom } from "./defaults";

import { prebuiltGameDesign } from '../../../data/fullGame';
import { listIds, findById, findIndexById } from "../../lib/util";
import { RoomData, GameDesign, GameDataItem, Interaction, Ending } from "src";


import { populateServicesForPreBuiltGame } from "../../services/populateServices";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";
import { SequenceEditor } from "./SequenceEditor";

import layoutStyles from "./editorLayoutStyles.module.css";
import { EndingEditor } from "./EndingEditor";
import spriteSheetService from "../../services/spriteSheetService";
import Game from "../Game";
import { GameDesignSaveAndLoad } from "./GameDesignSaveAndLoad";


const usePrebuiltGame = true
if (usePrebuiltGame) {
    populateServicesForPreBuiltGame()
}

type State = {
    gameDesign: GameDesign;
    tabOpen: number;
    roomId?: string;
    itemId?: string;
    characterId?: string;
    conversationId?: string;
    spriteId?: string;
    spriteSheetId?: string;
    sequenceId?: string;
    endingId?: string;

    resetTimeStamp: number;
};

type Props = {

}

const tabs: string[] = [
    'main',
    'rooms',
    'items',
    'characters',
    'conversations',
    'sprites',
    'spriteSheets',
    'interactions',
    'sequences',
    'endings',
    'images',
    'test',
]

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
        if (usePrebuiltGame) {
            this.state = {
                gameDesign: {
                    ...prebuiltGameDesign
                },
                tabOpen: tabs.indexOf('main'),
                resetTimeStamp: 0,
            }
        } else {
            const blankRoom: RoomData = Object.assign(getBlankRoom(), { id: 'ROOM_1', height: 150 })
            this.state = {
                gameDesign: {
                    id: "NEW_GAME",
                    rooms: [blankRoom],
                    characters: [],
                    interactions: [],
                    items: [],
                    conversations: [],
                    verbs: defaultVerbs1(),
                    currentRoomId: blankRoom.id,
                    sequences: [],
                    sprites: [],
                    spriteSheets: [],
                    endings: [],
                },
                tabOpen: tabs.indexOf('main'),
                resetTimeStamp: 0,
            }
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
    get currentCharacter() {
        return findById(this.state.characterId, this.state.gameDesign.characters)
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
            let { roomId, itemId, characterId, spriteId, spriteSheetId, sequenceId, endingId } = state
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
                case 'characters': {
                    addNewOrUpdate(data, gameDesign[property])
                    characterId = (data as GameDataItem).id
                    break
                }
                case 'conversations': {
                    addNewOrUpdate(data, gameDesign[property])
                    characterId = (data as GameDataItem).id
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
                case 'id':
                case 'currentRoomId': {
                    gameDesign[property] = data as string
                    break
                }
            }
            return { gameDesign, roomId, itemId, characterId, spriteId, spriteSheetId, sequenceId, endingId }
        })
    }

    deleteArrayItem(index: number, property: keyof GameDesign) {
        this.setState(state => {
            const { gameDesign } = state

            switch (property) {
                case 'interactions':
                    gameDesign[property].splice(index, 1)
                    break
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
            characterId: undefined,
            spriteId: undefined,
            spriteSheetId: undefined,
            conversationId: undefined,
            sequenceId: undefined,
            endingId: undefined,
        }
    }

    render() {
        const { gameDesign, tabOpen, roomId, itemId, characterId, spriteId, spriteSheetId, conversationId, sequenceId, endingId } = this.state

        const makeFolder = (id: string, list?: { id: string }[], entryId?: string): Folder => {
            const entries: Entry[] | undefined = list?.map(item => ({ data: item, active: entryId === item.id }))
            if (entries && !entryId) {
                entries.push({ data: { id: '' }, active: true, label: '*new*', isForNew: true })
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
            makeFolder('characters', gameDesign.characters, characterId),
            makeFolder('conversations', gameDesign.conversations, conversationId),
            makeFolder('sprites', gameDesign.sprites, spriteId),
            makeFolder('spriteSheets', gameDesign.spriteSheets, spriteSheetId),
            makeFolder('interactions'),
            makeFolder('sequences', gameDesign.sequences, sequenceId),
            makeFolder('endings', gameDesign.endings, endingId),
            makeFolder('images'),
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
                        if (!isForNew) {
                            switch (folderId) {
                                case 'rooms':
                                    modification.roomId = data.id
                                    break;
                                case 'items':
                                    modification.itemId = data.id
                                    break;
                                case 'characters':
                                    modification.characterId = data.id
                                    break;
                                case 'conversations':
                                    modification.conversationId = data.id
                                    break;
                                case 'sprites':
                                    modification.spriteId = data.id
                                    break;
                                case 'spriteSheets':
                                    modification.spriteSheetId = data.id
                                    break;
                                case 'sequences':
                                    modification.sequenceId = data.id
                                    break;
                                case 'endings':
                                    modification.endingId = data.id
                                    break;
                            }
                        }
                        this.setState(modification)
                    }}
                />

                <hr />

                <div>
                    <button onClick={() => this.setState({ tabOpen: tabs.indexOf("test") })}>Test Game</button>
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
                            existingRoomIds={listIds(gameDesign.rooms)}
                            key={roomId} data={this.currentRoom} />
                    },
                    {
                        label: 'Items', content: <ItemEditor
                            updateData={data => { this.performUpdate('items', data) }}
                            itemIds={listIds(gameDesign.items)}
                            characterIds={listIds(gameDesign.characters)}
                            key={itemId} data={this.currentItem}
                        />
                    },
                    {
                        label: 'Character Editor', content: <CharacterEditor
                            rooms={gameDesign.rooms}
                            characters={gameDesign.characters}
                            characterIds={listIds(gameDesign.characters)}
                            updateData={data => { this.performUpdate('characters', data) }}
                            key={characterId} data={this.currentCharacter}
                        />
                    },
                    {
                        label: 'Conversation Editor', content: <ConversationEditor
                            sequenceIds={listIds(gameDesign.sequences)}
                            conversations={gameDesign.conversations}
                            updateData={data => { this.performUpdate('conversations', data) }}
                            key={conversationId} data={this.currentConversation}
                        />
                    },
                    {
                        label: 'Sprite Editor', content: <SpriteEditor
                            updateData={data => { this.performUpdate('sprites', data) }}
                            key={spriteId} data={this.currentSprite}
                            spriteIds={listIds(gameDesign.sprites)}
                        />
                    },
                    {
                        label: 'Sprite Sheets', content: <SpriteSheetTool
                            updateData={data => { this.performUpdate('spriteSheets', data) }}
                            key={spriteSheetId} data={this.currentSpriteSheet}
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
                            sequenceId={sequenceId} />
                    },
                    {
                        label: 'endings', content: <EndingEditor
                            key={endingId}
                            gameDesign={gameDesign}
                            data={findById(endingId, gameDesign.endings)}
                            updateData={data => { this.performUpdate('endings', data) }}
                        />
                    },
                    { label: 'Image uploader', content: <ImageAssetTool /> },
                    {
                        label: 'Test', content: (
                            <div>
                                <button onClick={() => { this.setState({ resetTimeStamp: Date.now() }) }} >reset game test</button>
                                <hr />
                                <Game key={this.state.resetTimeStamp}
                                    {...gameDesign} characterOrders={{}}
                                    showDebugLog={true} />
                            </div>
                        )
                    }
                ]} />
            </section>

        </main >
    }
}
