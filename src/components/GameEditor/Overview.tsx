/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { eventToString, listIds } from "../../lib/util";
import { GameDesign, GameDesignSchema } from "../../definitions/Game";
import { SelectInput, TextInput, Warning } from "./formControls";
import {
  downloadJsonFile,
  makeDownloadFile,
  uploadFile,
  uploadJsonData,
} from "../../lib/files";
import { useState } from "preact/hooks";
import { buildGameZipBlob, readGameFromZipFile } from "../../lib/zipFiles";
import imageService from "../../services/imageService";

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
  const [loadError, setLoadError] = useState<string | undefined>(undefined);
  const [downloadAllError, setDownloadAllError] = useState<string | undefined>(
    undefined
  );
  const [uploadAllError, setUploadAllError] = useState<string | undefined>(
    undefined
  );

  const handleLoad = async () => {
    setLoadError(undefined);
    const { data, error, errorDetails } = await uploadJsonData(
      GameDesignSchema
    );
    if (error) {
      setLoadError(error);
      console.warn(errorDetails);
    }
    if (data) {
      loadNewGame(data);
    }
  };

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
    imageService.add(result.data.imageAssets)
  };

  return (
    <article>
      <h2>Main</h2>
      <p>starting room = {gameDesign.currentRoomId}</p>

      {/* this isn't impacting the Game route - because it has its own clone of starting conditions */}
      {/* Need to think about this! */}

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
        <button
          onClick={() => {
            downloadJsonFile(gameDesign, "game");
          }}
        >
          Save game data to file
        </button>
      </div>
      <div>
        <button onClick={handleLoad}>Load game data from file</button>
        <span>{loadError}</span>
      </div>

      <hr />
      <div>
        <button onClick={downloadAll}>
          Save full game to file (including assets)
        </button>
        {downloadAllError && <Warning>{downloadAllError}</Warning>}
      </div>
      <div>
        <button onClick={uploadAll}>Load game data(including assets) from zip file</button>
        {uploadAllError && <Warning>{uploadAllError}</Warning>}
      </div>
    </article>
  );
};
