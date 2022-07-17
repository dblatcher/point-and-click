/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { eventToString, listIds } from "../../lib/util";
import { GameDesign } from "../../definitions/Game";
import { SelectInput, TextInput } from "./formControls";
import { downloadJsonFile, uploadJsonData } from "../../lib/files";
import { isGameDesign } from "../../lib/typeguards";
import { useState } from "preact/hooks";

interface Props {
    gameDesign: GameDesign;
    edit: { (property: keyof GameDesign, value: unknown): void };
    loadNewGame: { (data: GameDesign): void };
}


export const Overview: FunctionalComponent<Props> = ({ gameDesign, edit, loadNewGame }: Props) => {

    const [loadError, setLoadError] = useState<string | undefined>(undefined)

    const handleLoad = async () => {
        setLoadError(undefined)
        const { data, error } = await uploadJsonData(isGameDesign)
        if (error) {
            setLoadError(error)
        }
        if (data) {
            loadNewGame(data)
        }
    }

    return <article>
        <h2>Main</h2>
        <p>starting room = {gameDesign.currentRoomId}</p>

        {/* this isn't impacting the Game route - because it has its own clone of starting conditions */}
        {/* Need to think about this! */}

        <TextInput value={gameDesign.id}
            label="Game ID"
            onInput={event => { edit('id', eventToString(event)) }}
        />

        <SelectInput value={gameDesign.currentRoomId}
            label={'Starting Room'}
            items={listIds(gameDesign.rooms)}
            onSelect={(value) => { edit('currentRoomId', value) }}
        />

        <ul>
            <li>rooms: {gameDesign.rooms.length}</li>
            <li>items: {gameDesign.items.length}</li>
            <li>characters: {gameDesign.characters.length}</li>
            <li>sprites: {gameDesign.sprites.length}</li>
            <li>sprite sheets: {gameDesign.spriteSheets.length}</li>
            <li>interactions: {gameDesign.interactions.length}</li>
        </ul>

        <div>
            <button onClick={() => { downloadJsonFile(gameDesign, 'game') }}>Save game data to file</button>
        </div>
        <div>
            <button onClick={handleLoad}>Load game from file</button>
            <span>{loadError}</span>
        </div>
    </article>
}
