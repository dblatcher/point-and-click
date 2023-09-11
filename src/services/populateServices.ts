import { GameDesign } from "../definitions/Game";
import imageService, { ImageAsset } from "./imageService";
import soundService, { SoundAsset } from "./soundService";


export function populateServices(
  gameDesign: GameDesign,
  imageAssets: ImageAsset[],
  soundAssets: SoundAsset[],
): void {
  console.log("populating services for:", gameDesign.id);
  // spriteService.add(gameDesign.sprites.map((data) => new Sprite(data)));
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}
