import { TypedEmitter } from "tiny-typed-emitter";
import { getMimeType } from "./assets";
import { FileAsset } from "@/services/assets";
import { fileToObjectUrl } from "@/lib/files";

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

export class FileAssetService<FileAssetType extends FileAsset> extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, FileAssetType | undefined>

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

    add(items: FileAssetType | FileAssetType[]): void {
        if (!Array.isArray(items)) {
            items = [items]
        }
        items.forEach(item => this.data[item.id] = item)
        this.reportUpdate('add', items.map(item => item.id))
    }

    addFromFile(assetsAndFiles: {
        asset: FileAssetType;
        file: File;
    }[]) {
        const newAssets = assetsAndFiles.map(({ asset, file }) => {
            console.log({ asset }, file)
            const objectUrl = fileToObjectUrl(file)
            if (!objectUrl) {
                console.error('failed to get object URL', asset, file)
                return asset
            }
            const newAsset: FileAssetType = { ...asset, href: objectUrl }
            return newAsset;
        })

        // TO DO - the reportUpdate is triggering putting the file in the DB again
        // even if they just came from the DB
        // need to add a flag to the event to say already in DB?
        this.add(newAssets)
    }

    async getWithFile(id:string) {
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

    remove(ids: string | string[]): void {
        if (!Array.isArray(ids)) {
            ids = [ids]
        }
        // TO DO - need to revoke object URL before deleting the assets
        ids.forEach(id => {
            if (id in this.data) {
                delete this.data[id]
            }
        })
        this.reportUpdate('remove', ids)
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

    populate(items: FileAssetType[]) {
        this.data = {}
        items.forEach(item => this.data[item.id] = item)
        this.reportUpdate('populate', items.map(item => item.id))
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

    listHref(): string[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => asset.href)
    }
}
