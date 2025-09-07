import { ImageService } from "./imageService";
import { SoundService } from "./soundService";
import { SoundAsset, ImageAsset } from "./assets";

import { imageAssets, soundAssets } from "../data/fullGame";
import { GameDesign } from "../definitions/Game";
import { UpdateSource } from "./FileAssetService";

export function populateServicesForPreBuiltGame(
  imageService: ImageService,
  soundService: SoundService
): void {
  console.log("populating services for prebuilt game");
  imageService.populate(imageAssets);
  soundService.populate(soundAssets);
}

export function populateServices(
  gameDesign: GameDesign,
  imageAssets: ImageAsset[],
  soundAssets: SoundAsset[],
  imageService: ImageService,
  soundService: SoundService,
  source?: UpdateSource,
): void {
  console.log("populating services for:", gameDesign.id, { source });
  imageService.populate(imageAssets, source);
  soundService.populate(soundAssets, source);
}
