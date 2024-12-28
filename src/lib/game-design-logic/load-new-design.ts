import { GameDesign } from "@/definitions";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { populateServices } from "@/services/populateServices";
import { GameDesignAction } from "./types";
import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";

export const higherLevelLoadNewGame = (
    dispatchDesignUpdate: React.Dispatch<GameDesignAction>,
    soundService: SoundService,
    imageService: ImageService,
) => (
    data: {
        gameDesign: GameDesign;
        imageAssets: ImageAsset[];
        soundAssets: SoundAsset[];
    }
) => {
        soundService.removeAll();
        imageService.removeAll();
        dispatchDesignUpdate({ type: 'load-new', gameDesign: data.gameDesign })
        populateServices(
            data.gameDesign, data.imageAssets, data.soundAssets,
            imageService, soundService
        )
    }