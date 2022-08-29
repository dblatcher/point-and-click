import imageService, { ImageAsset } from "./imageService";
import soundService, { SoundService, SoundAsset } from "./soundService";
import spriteService from "./spriteService";
import spriteSheetService from "./spriteSheetService";
import { Sprite } from "../lib/Sprite";
import { assets } from "../../data/images";
import { prebuiltGameDesign } from "../../data/fullGame";
import { GameDesign } from "../definitions/Game";

const testSoundAsset: SoundAsset = {
  id: 'beep',
  href: './assets/beep.mp3',
  category: 'sfx',
}

export function populateServicesForPreBuiltGame(): void {
  const sprites = prebuiltGameDesign.sprites.map((data) => new Sprite(data));
  console.log("populating services");
  spriteService.add(sprites);
  spriteSheetService.add(prebuiltGameDesign.spriteSheets);
  imageService.add(assets);
}

export function populateServices(
  gameDesign: GameDesign,
  imageAssets: ImageAsset[]
): void {
  console.log("populating services for:", gameDesign.id);
  spriteService.add(gameDesign.sprites.map((data) => new Sprite(data)));
  spriteSheetService.add(gameDesign.spriteSheets);
  imageService.add(imageAssets);

  soundService.add(testSoundAsset);
  if (typeof window !== 'undefined') {
    (window as unknown as Window & { soundService: SoundService }).soundService = soundService
  }
}
