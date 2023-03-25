import imageService, { ImageAsset } from "./imageService";
import soundService, { SoundAsset } from "./soundService";
import spriteService from "./spriteService";
import { Sprite } from "@/lib/Sprite";
import { imageAssets } from "../data/images";
import { soundAssets } from "../data/sounds";
import { prebuiltGameDesign } from "../data/fullGame";
import { GameDesign } from "../oldsrc/definitions/Game";

export function populateServicesForPreBuiltGame(): void {
  const sprites = prebuiltGameDesign.sprites.map((data) => new Sprite(data));
  console.log("populating services");
  spriteService.add(sprites);
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}

export function populateServices(
  gameDesign: GameDesign,
  imageAssets: ImageAsset[],
  soundAssets: SoundAsset[],
): void {
  console.log("populating services for:", gameDesign.id);
  spriteService.add(gameDesign.sprites.map((data) => new Sprite(data)));
  imageService.add(imageAssets);
  soundService.add(soundAssets);
}
