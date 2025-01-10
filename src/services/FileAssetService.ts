import { TypedEmitter } from "tiny-typed-emitter";
import { getMimeType } from "./assets";
import { FileAsset } from "@/services/assets";

type UpdateAction = 'add' | 'remove' | 'populate'

export type AssetServiceUpdate = {
    count: number,
    action: UpdateAction,
    ids: string[],
};

interface ServiceEvents {
    'update': (update: AssetServiceUpdate) => void;
    'ready': (isReady: boolean) => void;
    'load': (id: string, success: boolean) => void;
}

export class FileAssetService<T extends FileAsset> extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, T | undefined>

    constructor() {
        super()
        this.data = {}
    }

    reportUpdate(action: UpdateAction, ids: string[]): void {
        setTimeout(() => {
            this.emit('update', {
                count: this.list().length,
                action,
                ids,
            })
        }, 1)
    }

    add(items: T | T[]): void {
        if (!Array.isArray(items)) {
            items = [items]
        }
        items.forEach(item => this.data[item.id] = item)
        this.reportUpdate('add', items.map(item => item.id))
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
        this.reportUpdate('remove', ids)
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

    populate(items: T[]) {
        this.data = {}
        items.forEach(item => this.data[item.id] = item)
        this.reportUpdate('populate', items.map(item => item.id))
    }

    getFile = async (id: string): Promise<File | undefined> => {
        const asset = this.get(id)
        if (!asset) { return undefined }
        try {
            const response = await fetch(asset.href)
            const blob = await response.blob()
            return new File([blob], asset.id, { type: getMimeType(asset) })
        } catch (err) {
            console.warn(err)
            return undefined
        }
    }

    listHref(): string[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => asset.href)
    }
}
