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

import { startingGameCondition } from '../../../data/fullGame';
import { listIds, findById, findIndexById } from "../../lib/util";
import { RoomData, GameDesign, GameDataItem, Interaction } from "src";


import { populate } from "../../services/populateServices";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";
import { SequenceEditor } from "./SequenceEditor";


populate()

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
    'images',
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

const usePrebuiltGame = true

export class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        if (usePrebuiltGame) {
            this.state = {
                gameDesign: {
                    ...startingGameCondition
                },
                tabOpen: tabs.indexOf('rooms'),
                conversationId: 'CHAT',
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
                    spriteSheets: []
                },
                tabOpen: tabs.indexOf('rooms'),
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
            let { roomId, itemId, characterId, spriteId, spriteSheetId, sequenceId } = state
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
                case 'id':
                case 'currentRoomId': {
                    gameDesign[property] = data as string
                    break
                }
            }
            return { gameDesign, roomId, itemId, characterId, spriteId, spriteSheetId, sequenceId }
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
        console.log(gameDesign)
        this.setState({ gameDesign })
    }

    get noOpenItemsState(): Partial<State> {
        return {
            roomId: undefined,
            itemId: undefined,
            characterId: undefined,
            spriteId: undefined,
            spriteSheetId: undefined,
            conversationId: undefined,
        }
    }

    render() {
        const { gameDesign, tabOpen, roomId, itemId, characterId, spriteId, spriteSheetId, conversationId, sequenceId } = this.state

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
            makeFolder('images'),
        ]

        return <main>
            <div style={{ display: 'flex' }}>
                <TreeMenu folders={folders}
                    title={gameDesign.id}
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
                            }
                        }
                        this.setState(modification)
                    }}
                />

                <section style={{ flex: 1 }}>
                    <TabMenu backgroundColor="none" noButtons defaultOpenIndex={tabOpen} tabs={[
                        {
                            label: 'main', content: <Overview
                                gameDesign={gameDesign}
                                loadNewGame={this.loadNewGame}
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
                                roomIds={listIds(gameDesign.rooms)}
                                characterIds={listIds(gameDesign.characters)}
                                updateData={data => { this.performUpdate('characters', data) }}
                                key={characterId} data={this.currentCharacter}
                            />
                        },
                        {
                            label: 'Conversation Editor', content: <ConversationEditor
                                sequenceIds={Object.keys(gameDesign.sequences)}
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
                        { label: 'Image uploader', content: <ImageAssetTool /> },
                    ]} />
                </section>
            </div>
        </main>
    }
}
