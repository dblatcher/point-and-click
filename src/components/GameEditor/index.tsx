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


populate()

type GameDesign = Omit<GameCondition, 'characterOrders' | 'thingOrders' | 'sequenceRunning'>

type State = {
    gameDesign: GameDesign;
    roomId?: string;
    tabOpen: number;
};

type Props = {

}


export class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        const blankRoom: RoomData = Object.assign(getBlankRoom(), { id: 'ROOM_1', height: 150 })
        const blankRoom2: RoomData = Object.assign(getBlankRoom(), { id: 'ROOM_2', height: 250 })
        this.state = {
            gameDesign: {
                rooms: [blankRoom, blankRoom2],
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
        this.receiveUpdate = this.receiveUpdate.bind(this)
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
        const { roomId } = this.state
        const { rooms } = this.state.gameDesign
        return rooms.find(_ => _.id === roomId)
    }

    receiveUpdate(property: keyof GameDesign, data: unknown) {
        console.log(property, data)
        switch (property) {
            case 'rooms': {
                const roomData = data as RoomData;
                this.setState(state => {
                    const { gameDesign } = state
                    const matchingRoomIndex = gameDesign.rooms.findIndex(_ => _.id === roomData.id)

                    if (matchingRoomIndex !== -1) {
                        gameDesign.rooms.splice(matchingRoomIndex, 1, roomData)
                    } else {
                        gameDesign.rooms.push(roomData)
                    }
                    return { gameDesign }
                })
                break;
            }
        }
    }

    render() {
        const { gameDesign, roomId, tabOpen } = this.state
        return <main>
            <h2>Game Editor</h2>

            <SelectInput
                label="rooms"
                value={roomId || ''}
                items={gameDesign.rooms.map(room => room.id)}
                onSelect={(roomId) => {
                    this.setState({
                        roomId,
                        tabOpen: 3
                    })
                }}
                haveEmptyOption={true}
            />

            <TabMenu backgroundColor="none" defaultOpenIndex={tabOpen} tabs={[
                { label: 'Items', content: <ItemEditor /> },
                { label: 'Images', content: <ImageAssetTool /> },
                { label: 'Character Editor', content: <CharacterEditor /> },
                {
                    label: 'Room Editor', content: <RoomEditor
                        updateData={data => { this.receiveUpdate('rooms', data) }}
                        key={roomId} data={this.currentRoom} />
                },
                { label: 'Sprite Editor', content: <SpriteEditor /> },
                { label: 'Sprite Sheet Tool', content: <SpriteSheetTool /> },
            ]} />
        </main>
    }
}
