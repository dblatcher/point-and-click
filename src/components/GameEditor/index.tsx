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
    roomName?: string;
    tabOpen: number;
};

type Props = {

}


export class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)
        const blankRoom: RoomData = Object.assign(getBlankRoom(), { name: 'ROOM_1', height: 150 })
        const blankRoom2: RoomData = Object.assign(getBlankRoom(), { name: 'ROOM_2', height: 250 })
        this.state = {
            gameDesign: {
                rooms: [blankRoom, blankRoom2],
                things: [],
                characters: [],
                interactions: [],
                items: [],
                conversations: [],
                verbs: defaultVerbs1(),
                currentRoomName: blankRoom.name,
                sequences: {},
            },
            tabOpen: 2,
        }
        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
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
        const { roomName } = this.state
        const { rooms } = this.state.gameDesign
        return rooms.find(_ => _.name === roomName)
    }

    render() {
        const { gameDesign, roomName, tabOpen } = this.state
        return <main>
            <h2>Game Editor</h2>

            <SelectInput
                label="rooms"
                value={roomName || ''}
                items={gameDesign.rooms.map(room => room.name)}
                onSelect={(roomName) => {
                    this.setState({
                        roomName,
                        tabOpen: 3
                    })
                }}
                haveEmptyOption={true}
            />

            <TabMenu backgroundColor="none" defaultOpenIndex={tabOpen} tabs={[
                { label: 'Items', content: <ItemEditor /> },
                { label: 'Images', content: <ImageAssetTool /> },
                { label: 'Character Editor', content: <CharacterEditor /> },
                { label: 'Room Editor', content: <RoomEditor 
                    updateData={data=>(console.log('UPDATE', data.name, data))}
                    key={roomName} data={this.currentRoom} /> },
                { label: 'Sprite Editor', content: <SpriteEditor /> },
                { label: 'Sprite Sheet Tool', content: <SpriteSheetTool /> },
            ]} />
        </main>
    }
}
