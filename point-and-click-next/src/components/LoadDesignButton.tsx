import { GameDesign } from "@/oldsrc";
import { uploadFile } from "@/oldsrc/lib/files";
import { readGameFromZipFile } from "@/oldsrc/lib/zipFiles";
import { populateServices } from "@/oldsrc/services/populateServices";
import { FunctionComponent } from "react";

interface Props {
    onLoad: { (design: GameDesign): void }
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
        populateServices(gameDesign, imageAssets, soundAssets);
        onLoad(gameDesign)
    }

    return <button onClick={upload}>Load Design</button>
}