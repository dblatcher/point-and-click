import { FunctionComponent, useState } from "react";
import { GameDesign } from "@/definitions/Game";
import {
  makeDownloadFile,
  uploadFile,
} from "@/lib/files";
import { buildGameZipBlob, readGameFromZipFile } from "@/lib/zipFiles";
import { ImageService } from "@/services/imageService";
import { populateServices } from "@/services/populateServices";
import { SoundService } from "@/services/soundService";
import { Alert, ButtonGroup, IconButton, Tooltip, Badge } from "@mui/material"
import { DownloadIcon, UploadIcon, UndoIcon } from "@/components/GameEditor/material-icons"

interface Props {
  gameDesign: GameDesign;
  loadNewGame: { (data: GameDesign): void };
  undo: { (): void };
  history: { gameDesign: GameDesign; label: string }[];
  imageService: ImageService
  soundService: SoundService
}

export const SaveLoadAndUndo: FunctionComponent<Props> = ({
  gameDesign,
  loadNewGame,
  undo,
  history,
  imageService,
  soundService,
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
    populateServices(
      result.data.gameDesign, result.data.imageAssets, result.data.soundAssets, 
      imageService, soundService
    )
  };

  const undoLabel = history.length > 0 ? `undo ${history[history.length - 1]?.label}` : 'undo'
  const saveLabel = 'Save game to zip file'
  const loadLabel = 'Load game from zip file'

  return (<>
    <ButtonGroup orientation="horizontal">
      <Tooltip title={saveLabel}>
        <IconButton
          aria-label={saveLabel}
          onClick={downloadAll}
        >
          <DownloadIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title={loadLabel}>
        <IconButton
          aria-label={loadLabel}
          onClick={uploadAll}
        >
          <UploadIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Tooltip title={undoLabel}>
        <IconButton aria-label={undoLabel} onClick={undo}>
          <Badge badgeContent={history.length} color='primary'>
            <UndoIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>

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
