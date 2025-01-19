import { DownloadIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import {
  makeDownloadFile,
  uploadFile,
} from "@/lib/files";
import { higherLevelLoadNewGame } from "@/lib/game-design-logic/load-new-design";
import { buildGameZipBlob, readGameFromZipFile } from "@/lib/zipFiles";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { FunctionComponent, useState } from "react";


export const ZipFileButtons: FunctionComponent = () => {
  const { gameDesign, dispatchDesignUpdate } = useGameDesign()
  const { imageService, soundService } = useAssets()
  const [downloadAllError, setDownloadAllError] = useState<string | undefined>(
    undefined
  );
  const [uploadAllError, setUploadAllError] = useState<string | undefined>(
    undefined
  );

  const loadNewGame = higherLevelLoadNewGame(dispatchDesignUpdate, soundService, imageService);

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
    loadNewGame({ ...result.data, source: 'ZIP' },)
  };

  const saveLabel = 'Save game to zip file'
  const loadLabel = 'Load game from zip file'

  return (<>
    <Tooltip title={saveLabel}>
      <IconButton
        aria-label={saveLabel}
        onClick={downloadAll}
      >
        <DownloadIcon fontSize="large" />
      </IconButton>
    </Tooltip>
    <Snackbar open={!!downloadAllError} autoHideDuration={5000} onClose={() => setDownloadAllError(undefined)}>
      <Alert severity="error">{downloadAllError}</Alert>
    </Snackbar>

    <Tooltip title={loadLabel}>
      <IconButton
        aria-label={loadLabel}
        onClick={uploadAll}
      >
        <UploadIcon fontSize="large" />
      </IconButton>
    </Tooltip>
    <Snackbar open={!!uploadAllError} autoHideDuration={5000} onClose={() => setUploadAllError(undefined)}>
      <Alert severity="error">{uploadAllError}</Alert>
    </Snackbar>
  </>
  );
};