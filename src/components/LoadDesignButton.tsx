import { GameDesign } from "point-click-lib";
import { uploadFile } from "@/lib/files";
import { readParseAndUpdateGameFromZipFile } from "@/lib/zipFiles";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { Button } from "@mui/material";
import { FunctionComponent } from "react";
import UploadIcon from '@mui/icons-material/Upload';

interface Props {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}

export const LoadDesignButton: FunctionComponent<Props> = ({ onLoad, onError }) => {

    const upload = async () => {

        const file = await uploadFile();
        if (!file) {
            return;
        }

        const result = await readParseAndUpdateGameFromZipFile(file);
        if (!result.success) {
            onError(result.error)
            return;
        }

        const { gameDesign, imageAssets, soundAssets } = result.data;
        onLoad(gameDesign, imageAssets, soundAssets)
    }

    return <Button
        variant="contained"
        onClick={upload}
        endIcon={<UploadIcon />}
    >Play game from .game.zip file</Button>
}