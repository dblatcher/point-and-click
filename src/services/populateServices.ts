import imageService, { ImageAsset } from "./imageService";
import soundService, { SoundAsset } from "./soundService";
import { imageAssets } from "../data/images";
import { soundAssets } from "../data/sounds";
import { GameDesign } from "../definitions/Game";

export function populateServicesForPreBuiltGame(): void {
  console.log("populating services");
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}

export function populateServices(
  gameDesign: GameDesign,
  imageAssets: ImageAsset[],
  soundAssets: SoundAsset[],
): void {
  console.log("populating services for:", gameDesign.id);
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}
