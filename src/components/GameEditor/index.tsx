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
import { GameCondition } from "../../definitions/Game";
import { defaultVerbs1, getBlankRoom } from "./defaults";
import { SelectInput } from "./formControls";
import { RoomData } from "../../definitions/RoomData";

import { startingGameCondition } from '../../../data/fullGame';


populate()

type GameDesign = Omit<GameCondition, 'characterOrders' | 'thingOrders' | 'sequenceRunning'>

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

const usePrebuiltGame = true

export class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        if (usePrebuiltGame) {
            this.state = {
                gameDesign: {
                    ...startingGameCondition
                },
                tabOpen: 2,
            }
        } else {
            const blankRoom: RoomData = Object.assign(getBlankRoom(), { id: 'ROOM_1', height: 150 })
            this.state = {
                gameDesign: {
                    rooms: [blankRoom],
                    things: [],
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
                tabOpen: 2,
            }
        }
        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
        this.performUpdate = this.performUpdate.bind(this)
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
            }
            return { gameDesign }
        })
    }

    render() {
        const { gameDesign, tabOpen, roomId, itemId, characterId, spriteId, spriteSheetId } = this.state
        return <main>
            <h2>Game Editor</h2>
            <SelectInput
                label="rooms"
                value={roomId || ''}
                items={gameDesign.rooms.map(room => room.id)}
                onSelect={(roomId) => {
                    this.setState({
                        roomId,
                        tabOpen: 0
                    })
                }}
                haveEmptyOption={true}
            />

            <SelectInput
                label="items"
                value={itemId || ''}
                items={gameDesign.items.map(item => item.id)}
                onSelect={(itemId) => {
                    this.setState({
                        itemId,
                        tabOpen: 1,
                    })
                }}
                haveEmptyOption={true}
            />

            <SelectInput
                label="character"
                value={characterId || ''}
                items={gameDesign.characters.map(item => item.id)}
                onSelect={(characterId) => {
                    this.setState({
                        characterId,
                        tabOpen: 2,
                    })
                }}
                haveEmptyOption={true}
            />

            <SelectInput
                label="sprites"
                value={spriteId || ''}
                items={gameDesign.sprites.map(item => item.id)}
                onSelect={(spriteId) => {
                    this.setState({
                        spriteId,
                        tabOpen: 3,
                    })
                }}
                haveEmptyOption={true}
            />

            <SelectInput
                label="spriteSheets"
                value={spriteSheetId || ''}
                items={gameDesign.spriteSheets.map(item => item.id)}
                onSelect={(spriteSheetId) => {
                    this.setState({
                        spriteSheetId,
                        tabOpen: 4,
                    })
                }}
                haveEmptyOption={true}
            />

            <TabMenu backgroundColor="none" defaultOpenIndex={tabOpen} tabs={[
                {
                    label: 'Room Editor', content: <RoomEditor
                        updateData={data => { this.performUpdate('rooms', data) }}
                        key={roomId} data={this.currentRoom} />
                },
                {
                    label: 'Items', content: <ItemEditor
                        updateData={data => { this.performUpdate('items', data) }}
                        key={itemId} data={this.currentItem}
                    />
                },
                {
                    label: 'Character Editor', content: <CharacterEditor
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
                { label: 'Sprite Sheets', content: <SpriteSheetTool /> },
                { label: 'Image uploader', content: <ImageAssetTool /> },
            ]} />
        </main>
    }
}
