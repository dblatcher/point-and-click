import { ImageService } from "./imageService";
import { SoundService } from "./soundService";
import { SoundAsset, ImageAsset } from "./assets";

import { imageAssets, } from "../data/images";
import { soundAssets } from "../data/sounds";
import { GameDesign } from "../definitions/Game";

export function populateServicesForPreBuiltGame(
  imageService: ImageService,
  soundService: SoundService
): void {
  console.log("populating services");
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}

export function populateServices(
  gameDesign: GameDesign,
  imageAssets: ImageAsset[],
  soundAssets: SoundAsset[],
  imageService: ImageService,
  soundService: SoundService,
): void {
  console.log("populating services for:", gameDesign.id);
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}
