import { TypedEmitter } from "tiny-typed-emitter";

interface ServiceEvents {
    'update': (length: number) => void;
    'ready': (isReady: boolean) => void;
    'load': (id: string, success: boolean) => void;
}

export interface ServiceItem {
    id: string;
}

export class Service<T extends ServiceItem> extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, T | undefined>

    constructor() {
        super()
        this.data = {}
    }

    reportUpdate(): void {
        setTimeout(() => {
            this.emit('update', this.list().length)
        },1)
    }

    add(items: T | T[]): void {
        if (!Array.isArray(items)) {
            items = [items]
        }
        items.forEach(item => this.data[item.id] = item)
        this.reportUpdate()
    }

    remove(ids: string | string[]): void {
        if (!Array.isArray(ids)) {
            ids = [ids]
        }
        ids.forEach(id => {
            if (id in this.data) {
                delete this.data[id]
            }
        })
        this.reportUpdate()
    }

    get(id: string): T | undefined {
        return this.data[id]
    }

    list(): string[] {
        return Object.keys(this.data)
    }

    getAll(): T[] {
        return Object.values(this.data).filter(item => !!item) as T[]
    }

    removeAll() {
        this.data = {}
        this.reportUpdate()
    }
}
