
import { Sprite } from "../../src/lib/Sprite";

class SpriteService {
    protected data: Record<string, Sprite | undefined>

    constructor() {
        this.data = {}
    }

    add(sprites: Sprite | Sprite[]): void {
        if (!Array.isArray(sprites)) {
            sprites = [sprites]
        }

        sprites.forEach(sprite => this.data[sprite.data.id] = sprite)
    }

    get(id: string): Sprite | undefined {
        return this.data[id]
    }

    list(): string[] {
        return Object.keys(this.data)
    }
}

const spriteService = new SpriteService()

export default spriteService;
