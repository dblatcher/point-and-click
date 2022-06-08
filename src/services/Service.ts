import { TypedEmitter } from "tiny-typed-emitter";

interface ServiceEvents {
    'update': (length: number) => void;
}

interface ServiceItem {
    id: string;
}

export class Service<T extends ServiceItem> extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, T | undefined>

    constructor() {
        super()
        this.data = {}
    }

    reportUpdate(): void {
        this.emit('update', this.list().length)
    }

    add(items: T | T[]): void {
        if (!Array.isArray(items)) {
            items = [items]
        }
        items.forEach(item => this.data[item.id] = item)
        this.reportUpdate()
    }

    get(id: string): T | undefined {
        return this.data[id]
    }

    list(): string[] {
        return Object.keys(this.data)
    }
}
