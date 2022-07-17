/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { listIds } from "../../lib/util";
import { GameDesign } from "../../definitions/Game";
import { SelectInput } from "./formControls";

interface Props {
    gameDesign: GameDesign;
    edit: { (property: keyof GameDesign, value: unknown): void };
}


export const Overview: FunctionalComponent<Props> = ({ gameDesign, edit }: Props) => {

    return <article>
        <h2>Main</h2>
        <p>starting room = {gameDesign.currentRoomId}</p>

        {/* this isn't impacting the Game route - because it has its own clone of starting conditions */}
        {/* Need to think about this! */}
        <SelectInput value={gameDesign.currentRoomId}
            label={'Starting Room'}
            items={listIds(gameDesign.rooms)}
            onSelect={(value) => { edit('currentRoomId', value) }}
        />

        <ul>
            <li>rooms: {gameDesign.rooms.length}</li>
            <li>items: {gameDesign.items.length}</li>
            <li>characters: {gameDesign.characters.length}</li>
            <li>interactions: {gameDesign.interactions.length}</li>
        </ul>

        <div>
            <button>Save to file</button>
        </div>
    </article>
}
