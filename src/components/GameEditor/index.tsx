/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";

import { SpriteSheetTool } from "./SpriteSheetTool";
import { RoomEditor } from "./RoomEditor";
import { SpriteEditor } from "./SpriteEditor";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";

import { TabMenu } from "../TabMenu";
import { CharacterEditor } from "./CharacterEditor";
import { ImageAssetTool } from "./ImageAssetTool";
import { populate } from "../../services/populateServices";
import { ItemEditor } from "./itemEditor";
import { GameDesign } from "../../definitions/Game";
import { defaultVerbs1, getBlankRoom } from "./defaults";
import { RoomData } from "../../definitions/RoomData";

import { startingGameCondition } from '../../../data/fullGame';
import { TreeMenu } from "./TreeMenu";
import { InteractionEditor } from "./InteractionEditor";
import { Interaction } from "src/definitions/Interaction";
import { Overview } from "./Overview";


populate()

type State = {
    gameDesign: GameDesign;
    tabOpen: number;
    roomId?: string;
    itemId?: string;
    characterId?: string;
    spriteId?: string;
    spriteSheetId?: string;
};

type Props = {

}

const tabs: string[] = [
    'main',
    'rooms',
    'items',
    'characters',
    'sprites',
    'spriteSheets',
    'interactions',
    'images',
]

function findById<T extends { id: string }>(id: string | undefined, list: T[]): (T | undefined) {
    if (!id) { return undefined }
    return list.find(_ => _.id === id)
}
function findIndexById<T extends { id: string }>(id: string | undefined, list: T[]): (number) {
    if (!id) { return -1 }
    return list.findIndex(_ => _.id === id)
}
function addNewOrUpdate<T extends { id: string }>(newData: unknown, list: T[]): T[] {
    const newItem = newData as T;
    const matchIndex = findIndexById(newItem.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newItem)
    } else {
        list.push(newItem)
    }
    return list
}
function listIds<T extends { id: string }>(list: T[]): string[] {
    return list.map(_ => _.id)
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
                tabOpen: tabs.indexOf('main'),
            }
        } else {
            const blankRoom: RoomData = Object.assign(getBlankRoom(), { id: 'ROOM_1', height: 150 })
            this.state = {
                gameDesign: {
                    rooms: [blankRoom],
                    characters: [],
                    interactions: [],
                    items: [],
                    conversations: [],
                    verbs: defaultVerbs1(),
                    currentRoomId: blankRoom.id,
                    sequences: {},
                    sprites: [],
                    spriteSheets: []
                },
                tabOpen: tabs.indexOf('main'),
            }
        }
        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
        this.performUpdate = this.performUpdate.bind(this)
        this.changeInteraction = this.changeInteraction.bind(this)
        this.deleteArrayItem = this.deleteArrayItem.bind(this)
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
            switch (property) {
                case 'rooms': {
                    addNewOrUpdate(data, gameDesign[property])
                    break
                }
                case 'items': {
                    addNewOrUpdate(data, gameDesign[property])
                    break
                }
                case 'characters': {
                    addNewOrUpdate(data, gameDesign[property])
                    break
                }
                case 'sprites': {
                    addNewOrUpdate(data, gameDesign[property])
                    break
                }
                case 'spriteSheets': {
                    addNewOrUpdate(data, gameDesign[property])
                    break
                }
                case 'currentRoomId': {
                    gameDesign[property] = data as string
                }
            }
            return { gameDesign }
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

    render() {
        const { gameDesign, tabOpen, roomId, itemId, characterId, spriteId, spriteSheetId } = this.state

        const makeFolder = (id: string, list?: { id: string }[], entryId?: string) => ({
            id, open: tabs[tabOpen] === id,
            entries: list?.map(item => ({ data: item, active: entryId === item.id }))
        })

        const folders = [
            makeFolder('main'),
            makeFolder('rooms', gameDesign.rooms, roomId),
            makeFolder('items', gameDesign.items, itemId),
            makeFolder('characters', gameDesign.characters, characterId),
            makeFolder('sprites', gameDesign.sprites, spriteId),
            makeFolder('spriteSheets', gameDesign.spriteSheets, spriteSheetId),
            makeFolder('interactions'),
            makeFolder('images'),
        ]

        return <main>
            <div style={{ display: 'flex' }}>
                <TreeMenu folders={folders}
                    folderClick={(folderId) => {
                        const folderIndex = tabs.indexOf(folderId);
                        this.setState({ tabOpen: folderIndex })
                    }}
                    entryClick={(folderId, data) => {
                        const folderIndex = tabs.indexOf(folderId);
                        const modification: Partial<State> = { tabOpen: folderIndex }
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
                            case 'sprites':
                                modification.spriteId = data.id
                                break;
                            case 'spriteSheets':
                                modification.spriteSheetId = data.id
                                break;
                        }
                        this.setState(modification)
                    }}
                />

                <section>
                    <TabMenu backgroundColor="none" noButtons defaultOpenIndex={tabOpen} tabs={[
                        {
                            label: 'main', content: <Overview
                                gameDesign={gameDesign}
                                edit={(property, value) => { this.performUpdate(property, value) }} />
                        },
                        {
                            label: 'Room Editor', content: <RoomEditor
                                updateData={data => { this.performUpdate('rooms', data) }}
                                key={roomId} data={this.currentRoom} />
                        },
                        {
                            label: 'Items', content: <ItemEditor
                                updateData={data => { this.performUpdate('items', data) }}
                                characterIds={listIds(gameDesign.characters)}
                                key={itemId} data={this.currentItem}
                            />
                        },
                        {
                            label: 'Character Editor', content: <CharacterEditor
                                roomIds={listIds(gameDesign.rooms)}
                                updateData={data => { this.performUpdate('characters', data) }}
                                key={characterId} data={this.currentCharacter}
                            />
                        },
                        {
                            label: 'Sprite Editor', content: <SpriteEditor
                                updateData={data => { this.performUpdate('sprites', data) }}
                                key={spriteId} data={this.currentSprite}
                            />
                        },
                        {
                            label: 'Sprite Sheets', content: <SpriteSheetTool
                                updateData={data => { this.performUpdate('spriteSheets', data) }}
                                key={spriteSheetId} data={this.currentSpriteSheet}
                            />
                        },
                        {
                            label: 'interactions', content: <InteractionEditor
                                changeInteraction={this.changeInteraction}
                                deleteInteraction={(index: number) => { this.deleteArrayItem(index, 'interactions') }}
                                gameDesign={gameDesign} />
                        },
                        { label: 'Image uploader', content: <ImageAssetTool /> },
                    ]} />
                </section>
            </div>
        </main>
    }
}
