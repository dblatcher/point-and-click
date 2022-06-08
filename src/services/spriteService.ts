import { Sprite } from "../../src/lib/Sprite";
import { Service } from "./Service";

class SpriteService extends Service<Sprite> {
}

const spriteService = new SpriteService()

export default spriteService;
