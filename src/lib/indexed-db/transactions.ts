import { GameDesign } from "@/definitions";
import { GameEditorDatabase, SavedDesignKey } from "./types";
import { ImageAsset, SoundAsset } from "@/services/assets";

export const setQuitSave = (db: GameEditorDatabase) => (design: GameDesign) => {
    return db.put('designs', { design, timestamp: Date.now() }, 'quit-save')
}

export const retrieveQuitSave = (db: GameEditorDatabase) => (): Promise<{
    design?: GameDesign;
    timestamp?: number;
}> => {
    return db.get('designs', 'quit-save').then(result => {
        return result ?? {}
    })
}

const makeAssetRecordKey = (savedDesignKey: SavedDesignKey, assetId: string) => `${savedDesignKey}__${assetId}`

export const storeImageAsset = (db: GameEditorDatabase) => async (asset: ImageAsset, file: File) => {
    const savedDesign: SavedDesignKey = 'quit-save'
    const copyOfAsset = { ...asset };
    delete copyOfAsset.img;

    return db.put('image-assets', {
        savedDesign,
        asset: copyOfAsset,
        file: file,
    }, makeAssetRecordKey(savedDesign, asset.id))
}

export const deleteImageAsset = (db: GameEditorDatabase) => (assetId: string) => {
    return db.delete('image-assets', makeAssetRecordKey('quit-save', assetId))
}

export const deleteAllImageAssets = (db: GameEditorDatabase) => async () => {
    const allKeys = await db.getAllKeysFromIndex('image-assets', 'by-design-key', 'quit-save')
    const tx = db.transaction('image-assets', 'readwrite', {})

    return await Promise.all([
        ...allKeys.map(key => {
            tx.store.delete(key)
        }),
        tx.done
    ])
}

export const retrieveImageAssets = (db: GameEditorDatabase) => () => {
    return db.getAllFromIndex('image-assets', 'by-design-key', 'quit-save')
}

export const storeSoundAsset = (db: GameEditorDatabase) => async (asset: SoundAsset, file: File) => {
    const savedDesign: SavedDesignKey = 'quit-save'
    const copyOfAsset = { ...asset };
    return db.put('sound-assets', {
        savedDesign,
        asset: copyOfAsset,
        file: file,
    }, makeAssetRecordKey(savedDesign, asset.id))
}

export const deleteSoundAsset = (db: GameEditorDatabase) => (assetId: string) => {
    return db.delete('sound-assets', makeAssetRecordKey('quit-save', assetId))
}

export const deleteAllSoundAssets = (db: GameEditorDatabase) => async () => {
    const allKeys = await db.getAllKeysFromIndex('sound-assets', 'by-design-key', 'quit-save')
    const tx = db.transaction('sound-assets', 'readwrite', {})

    return await Promise.all([
        ...allKeys.map(key => {
            tx.store.delete(key)
        }),
        tx.done
    ])
}

export const retrieveSoundAssets = (db: GameEditorDatabase) => () => {
    return db.getAllFromIndex('sound-assets', 'by-design-key', 'quit-save')
}
