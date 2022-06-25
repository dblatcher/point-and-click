/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";

import { SpriteSheetTool } from "../SpriteSheetTool";
import { RoomEditor } from "../RoomEditor";
import { SpriteEditor } from "../SpriteEditor";
import imageService from "../../services/imageService";
import spriteService from "../../services/spriteService";

import { TabMenu } from "../TabMenu";
import { CharacterEditor } from "../CharacterEditor";
import { ImageAssetTool } from "../ImageAssetTool";
import { populate } from "../../services/populateServices";


populate()


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
    }

    componentWillUnmount() {
        imageService.off('update', this.respondToServiceUpdate)
        spriteService.off('update', this.respondToServiceUpdate)
    }

    render() {

        return <main>
            <h2>Game Editor</h2>
            <TabMenu backgroundColor="none" tabs={[
                {label:'Images', content: <ImageAssetTool />},
                {label:'Character Editor', content: <CharacterEditor />},
                {label:'Room Editor', content: <RoomEditor />},
                {label:'Sprite Editor', content: <SpriteEditor />},
                {label:'Sprite Sheet Tool', content: <SpriteSheetTool />},
            ]} />
        </main>
    }
}
