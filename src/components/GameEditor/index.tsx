/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { startingGameCondition } from "../../../data/fullGame";
import { RoomData } from "../../definitions/RoomData";
import { dataToBlob, makeDownloadFile } from "../../lib/download";
import { SpriteData } from "../../definitions/SpriteSheet";
import { RoomEditor } from "../RoomEditor";
import { SpriteEditor } from "../SpriteEditor";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";
import { spriteInputs } from "../../../data/sprites";
import { assets } from "./images";


type State = {

};

type Props = {

}


export class GameEditor extends Component<Props, State>{

    constructor(props: Props) {
        super(props)

        this.state = {
        }
        this.respondToServiceUpdate = this.respondToServiceUpdate.bind(this)
    }

    respondToServiceUpdate(payload: unknown) {
        console.log('service update',{payload})
        this.forceUpdate()
    }

    componentDidMount() {
        imageService.on('update', this.respondToServiceUpdate)
        spriteService.on('update', this.respondToServiceUpdate)

        imageService.add(assets)
        console.log(imageService.list())
    }

    componentWillUnmount() {
        imageService.off('update', this.respondToServiceUpdate)
        spriteService.off('update', this.respondToServiceUpdate)
    }

    render() {

        return <main>
            <h2>Game Editor</h2>
            <SpriteEditor
                data={spriteInputs[1].data}
                saveFunction={(data: SpriteData): void => {
                    const blob = dataToBlob(data)
                    if (blob) {
                        makeDownloadFile(`${data.id || 'UNNAMED'}.sprite.json`, blob)
                    }
                }}
            />

            <hr />

            <RoomEditor
                data={startingGameCondition.rooms[0]}

                saveFunction={(roomData: RoomData): void => {
                    const blob = dataToBlob(roomData)
                    if (blob) {
                        makeDownloadFile(`${roomData.name || 'UNNAMED'}.room.json`, blob)
                    }
                }}
            />
        </main>
    }

}