import { GameDesign } from "@/oldsrc";
import { uploadFile } from "@/lib/files";
import { readGameFromZipFile } from "@/lib/zipFiles";
import { ImageAsset } from "@/services/imageService";
import { SoundAsset } from "@/services/soundService";
import { Button } from "@mui/material";
import { FunctionComponent } from "react";

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

        const result = await readGameFromZipFile(file);
        if (!result.success) {
            onError(result.error)
            return;
        }

        const { gameDesign, imageAssets, soundAssets } = result.data;
        onLoad(gameDesign, imageAssets, soundAssets)
    }

    return <Button onClick={upload}>Load Design</Button>
}