import { TypedEmitter } from "tiny-typed-emitter";
import { getMimeType } from "./assets";
import { FileAsset } from "@/services/assets";

type UpdateAction = 'add' | 'remove' | 'populate'
export type UpdateSource = 'DB' | 'ZIP'

export type AssetServiceUpdate = {
    count: number,
    action: UpdateAction,
    ids: string[],
    source?: UpdateSource,
};

interface ServiceEvents {
    'update': (update: AssetServiceUpdate) => void;
    'ready': (isReady: boolean) => void;
    'load': (id: string, success: boolean) => void;
}

export class FileAssetService<FileAssetType extends FileAsset> extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, FileAssetType | undefined>

    constructor() {
        super()
        this.data = {}
    }

    reportUpdate(action: UpdateAction, ids: string[], source?: UpdateSource): void {
        setTimeout(() => {
            this.emit('update', {
                count: this.list().length,
                action,
                ids,
                source,
            })
        }, 1)
    }

    add(items: FileAssetType | FileAssetType[], source?: UpdateSource): void {
        if (!Array.isArray(items)) {
            items = [items]
        }
        items.forEach(item => this.data[item.id] = item)
        this.postAdd(items)
        this.reportUpdate('add', items.map(item => item.id), source)
    }

    protected postAdd(items: FileAssetType[]) {
        console.log('postAdd', items)
    }

    async getWithFile(id: string) {
        const asset = this.get(id);
        if (!asset) {
            return {}
        }
        const file = await this.getFile(id)
        if (!file) {
            return {}
        }
        return { asset, file }
    }

    async getAllWithFiles() {
        const assets = this.getAll()
        const assetsWithFiles = await Promise.all(assets.map(async (asset) => {
            const file = await this.getFile(asset.id)
            if (!file) {
                return null
            }
            return { asset, file }
        }))

        return assetsWithFiles.flatMap(item => item ? item : [])
    }

    remove(ids: string | string[], source?: UpdateSource): void {
        if (!Array.isArray(ids)) {
            ids = [ids]
        }
        ids.forEach(id => {
            if (id in this.data) {
                // TO DO - revoking the object URL here works, but messes up the 
                // asset tools. Need to think about the UI
                // if (this.data[id]?.href) { URL.revokeObjectURL(this.data[id].href) }
                delete this.data[id]
            }
        })
        this.reportUpdate('remove', ids, source)
    }

    get(id: string): FileAssetType | undefined {
        return this.data[id]
    }

    list(): string[] {
        return Object.keys(this.data)
    }

    getAll(): FileAssetType[] {
        return Object.values(this.data).filter(item => !!item) as FileAssetType[]
    }

    populate(items: FileAssetType[], source?: UpdateSource) {
        this.getAll().map(asset => asset.href).map(href => URL.revokeObjectURL(href))
        this.data = {}
        items.forEach(item => this.data[item.id] = item)
        this.postAdd(items)
        this.reportUpdate('populate', items.map(item => item.id), source)
    }

    // TO DO store the files when loaded rather than 
    // creating every time
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
}
