import { FunctionComponent, useState } from "react";
import { GameDesign } from "@/oldsrc/definitions/Game";
import {
  makeDownloadFile,
  uploadFile,
} from "@/lib/files";
import { buildGameZipBlob, readGameFromZipFile } from "@/lib/zipFiles";
import imageService from "@/services/imageService";
import { populateServices } from "@/services/populateServices";
import soundService from "@/services/soundService";
import { Button, Alert, ButtonGroup } from "@mui/material"

interface Props {
  gameDesign: GameDesign;
  loadNewGame: { (data: GameDesign): void };
  undo: { (): void };
  history: { gameDesign: GameDesign; label: string }[];
}

export const SaveLoadAndUndo: FunctionComponent<Props> = ({
  gameDesign,
  loadNewGame,
  undo,
  history,
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

  return (<>
    <ButtonGroup orientation="vertical">
      <Button onClick={downloadAll} fullWidth>
        Save game to zip file
      </Button>
      <Button onClick={uploadAll} fullWidth>
        Load game from zip file
      </Button>

      <Button
        fullWidth
        onClick={undo}
        disabled={history.length === 0}
      >
        UNDO {history[history.length - 1]?.label} [{history.length}]
      </Button>
    </ButtonGroup>
    {downloadAllError && (
      <Alert severity="error">{downloadAllError}</Alert>
    )}
    {uploadAllError && (
      <Alert severity="error">{uploadAllError}</Alert>
    )}
  </>
  );
};
