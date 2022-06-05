
import { TypedEmitter } from "tiny-typed-emitter";
import { Sprite } from "../../src/lib/Sprite";

interface ServiceEvents {
    'update': (length: number) => void;
}

class SpriteService extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, Sprite | undefined>

    constructor() {
        super()
        this.data = {}
    }

    reportUpdate(): void {
        this.emit('update', this.list().length)
    }

    add(sprites: Sprite | Sprite[]): void {
        if (!Array.isArray(sprites)) {
            sprites = [sprites]
        }

        sprites.forEach(sprite => this.data[sprite.data.id] = sprite)
        this.reportUpdate()
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
