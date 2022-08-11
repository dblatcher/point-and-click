/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { eventToString, listIds } from "../../lib/util";
import { GameDesign } from "../../definitions/Game";
import { SelectInput, TextInput, Warning } from "./formControls";
import {
  makeDownloadFile,
  uploadFile,
} from "../../lib/files";
import { useState } from "preact/hooks";
import { buildGameZipBlob, readGameFromZipFile } from "../../lib/zipFiles";
import imageService from "../../services/imageService";
import { populateServices } from "../../services/populateServices";

interface Props {
  gameDesign: GameDesign;
  edit: { (property: keyof GameDesign, value: unknown): void };
  loadNewGame: { (data: GameDesign): void };
}

export const Overview: FunctionalComponent<Props> = ({
  gameDesign,
  edit,
  loadNewGame,
}: Props) => {

  const [downloadAllError, setDownloadAllError] = useState<string | undefined>(
    undefined
  );
  const [uploadAllError, setUploadAllError] = useState<string | undefined>(
    undefined
  );


  const downloadAll = async () => {
    setDownloadAllError(undefined);
    const result = await buildGameZipBlob(gameDesign, imageService);
    if (!result.success) {
      setDownloadAllError(result.error);
      return;
    }
    makeDownloadFile(`${gameDesign.id}.game.zip`, result.blob);
  };

  const uploadAll = async () => {
    setUploadAllError(undefined);

    const file = await uploadFile();
    if (!file) {
      return;
    }

    const result = await readGameFromZipFile(file);
    if (!result.success) {
      setUploadAllError(result.error);
      return;
    }

    loadNewGame(result.data.gameDesign)
    populateServices(result.data.gameDesign, result.data.imageAssets)
  };

  return (
    <article>
      <h2>Main</h2>
      <TextInput
        value={gameDesign.id}
        label="Game ID"
        onInput={(event) => {
          edit("id", eventToString(event));
        }}
      />

      <SelectInput
        value={gameDesign.currentRoomId}
        label={"Starting Room"}
        items={listIds(gameDesign.rooms)}
        onSelect={(value) => {
          edit("currentRoomId", value);
        }}
      />

      <ul>
        <li>rooms: {gameDesign.rooms.length}</li>
        <li>items: {gameDesign.items.length}</li>
        <li>characters: {gameDesign.characters.length}</li>
        <li>conversations: {gameDesign.conversations.length}</li>
        <li>sprites: {gameDesign.sprites.length}</li>
        <li>sprite sheets: {gameDesign.spriteSheets.length}</li>
        <li>interactions: {gameDesign.interactions.length}</li>
        <li>sequences: {gameDesign.sequences.length}</li>
        <li>endings: {gameDesign.endings.length}</li>
      </ul>

      <div>
        <button onClick={downloadAll}>
          Save game to zip file
        </button>
        {downloadAllError && <Warning>{downloadAllError}</Warning>}
      </div>
      <div>
        <button onClick={uploadAll}>Load game from zip file</button>
        {uploadAllError && <Warning>{uploadAllError}</Warning>}
      </div>
    </article>
  );
};
