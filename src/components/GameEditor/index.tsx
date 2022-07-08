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
import { ItemData } from "src/definitions/ItemData";


populate()

type GameDesign = Omit<GameCondition, 'characterOrders' | 'thingOrders' | 'sequenceRunning'>

type State = {
    gameDesign: GameDesign;
    tabOpen: number;
    roomId?: string;
    itemId?: string;
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
function addNewOrUpdate<T extends { id: string }>(newData: T, list: T[]): T[] {
    const matchIndex = findIndexById(newData.id, list)
    if (matchIndex !== -1) {
        list.splice(matchIndex, 1, newData)
    } else {
        list.push(newData)
    }
    return list
}

export class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
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
            },
            tabOpen: 2,
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

    performUpdate(property: keyof GameDesign, data: unknown) {
        console.log(property, data)
        switch (property) {
            case 'rooms': {
                this.setState(state => {
                    const { gameDesign } = state
                    addNewOrUpdate(data as RoomData, gameDesign.rooms)
                    return { gameDesign }
                })
                break;
            }
            case 'items': {
                this.setState(state => {
                    const { gameDesign } = state
                    addNewOrUpdate(data as ItemData, gameDesign.items)
                    return { gameDesign }
                })
                break;
            }
        }
    }

    render() {
        const { gameDesign, tabOpen, roomId, itemId } = this.state
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
                { label: 'Character Editor', content: <CharacterEditor /> },
                { label: 'Sprite Editor', content: <SpriteEditor /> },
                { label: 'Sprite Sheet Tool', content: <SpriteSheetTool /> },
                { label: 'Image uploader', content: <ImageAssetTool /> },
            ]} />
        </main>
    }
}
