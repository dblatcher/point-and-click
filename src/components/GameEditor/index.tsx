/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";

import { SpriteSheetTool } from "../SpriteSheetTool";
import { RoomEditor } from "../RoomEditor";
import { SpriteEditor } from "../SpriteEditor";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";
import spriteSheetService from "../../services/spriteSheetService";
import { spriteInputs } from "../../../data/sprites";
import { assets } from "./images";
import { Sprite } from "../../lib/Sprite";
import { TabMenu } from "../TabMenu";
import { CharacterEditor } from "../CharacterEditor";



const sprites = spriteInputs.map(input => new Sprite(input.data))
const spriteSheets = spriteInputs.flatMap(input => input.sheets)
spriteService.add(sprites)
spriteSheetService.add(spriteSheets)
console.log('adding from GameEditor')

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
        console.log('service update', { payload })
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
            <TabMenu backgroundColor="none" tabs={[
                {label:'Character Editor', content: <CharacterEditor  />},
                {label:'Room Editor', content: <RoomEditor />},
                {label:'Sprite Editor', content: <SpriteEditor />},
                {label:'Sprite Sheet Tool', content: <SpriteSheetTool />},
            ]} />
        </main>
    }
}
