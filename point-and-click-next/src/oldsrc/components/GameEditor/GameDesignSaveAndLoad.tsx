import { FunctionComponent, useState } from "react";
import { GameDesign } from "../../definitions/Game";
import { Warning } from "./formControls";
import {
  makeDownloadFile,
  uploadFile,
} from "../../../lib/files";
import { buildGameZipBlob, readGameFromZipFile } from "../../../lib/zipFiles";
import imageService from "../../../services/imageService";
import { populateServices } from "../../../services/populateServices";
import soundService from "../../../services/soundService";

interface Props {
  gameDesign: GameDesign;
  loadNewGame: { (data: GameDesign): void };
}

export const GameDesignSaveAndLoad: FunctionComponent<Props> = ({
  gameDesign,
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
    const result = await buildGameZipBlob(gameDesign, imageService, soundService);
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
    populateServices(result.data.gameDesign, result.data.imageAssets, result.data.soundAssets)
  };

  return (
    <section>
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
    </section>
  );
};
