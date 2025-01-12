import { GameDesign } from "@/definitions";
import { GameEditorDatabase, SavedDesignKey } from "./types";
import { ImageAsset, SoundAsset } from "@/services/assets";

export const listSavedDesignKeys = (db:GameEditorDatabase) => () => {
    return db.getAllKeys('designs')
}

export const storeSavedDesign = (db: GameEditorDatabase) => (design: GameDesign, savedDesign: SavedDesignKey = 'quit-save') => {
    return db.put('designs', { design, timestamp: Date.now() }, savedDesign)
}

export const retrieveSavedDesign = (db: GameEditorDatabase) => (savedDesign: SavedDesignKey = 'quit-save'): Promise<{
    design?: GameDesign;
    timestamp?: number;
}> => {
    return db.get('designs', savedDesign).then(result => {
        if (!result) {
            console.warn(`no saved design ${savedDesign}`)
        }
        return result ?? {}
    })
}

export const deleteSavedDesign = (db: GameEditorDatabase) => (savedDesign: SavedDesignKey) => {
    return db.delete('designs',savedDesign)
}

const makeAssetRecordKey = (savedDesign: SavedDesignKey, assetId: string) => `${savedDesign}__${assetId}`

export const storeImageAsset = (db: GameEditorDatabase) => async (asset: ImageAsset, file: File, savedDesign: SavedDesignKey = 'quit-save') => {
    const copyOfAsset = { ...asset };
    delete copyOfAsset.img;

    return db.put('image-assets', {
        savedDesign,
        asset: copyOfAsset,
        file: file,
    }, makeAssetRecordKey(savedDesign, asset.id))
}

export const deleteImageAsset = (db: GameEditorDatabase) => (assetId: string, savedDesign: SavedDesignKey = 'quit-save') => {
    return db.delete('image-assets', makeAssetRecordKey(savedDesign, assetId))
}

export const deleteAllImageAssets = (db: GameEditorDatabase, savedDesign: SavedDesignKey = 'quit-save') => async () => {
    const allKeys = await db.getAllKeysFromIndex('image-assets', 'by-design-key', savedDesign)
    const tx = db.transaction('image-assets', 'readwrite', {})

    return await Promise.all([
        ...allKeys.map(key => {
            tx.store.delete(key)
        }),
        tx.done
    ])
}

export const retrieveImageAssets = (db: GameEditorDatabase) => (savedDesign: SavedDesignKey = 'quit-save') => {
    return db.getAllFromIndex('image-assets', 'by-design-key', savedDesign)
}

export const storeSoundAsset = (db: GameEditorDatabase) => async (asset: SoundAsset, file: File,savedDesign: SavedDesignKey = 'quit-save') => {
    const copyOfAsset = { ...asset };
    return db.put('sound-assets', {
        savedDesign,
        asset: copyOfAsset,
        file: file,
    }, makeAssetRecordKey(savedDesign, asset.id))
}

export const deleteSoundAsset = (db: GameEditorDatabase) => (assetId: string, savedDesign: SavedDesignKey = 'quit-save') => {
    return db.delete('sound-assets', makeAssetRecordKey(savedDesign, assetId))
}

export const deleteAllSoundAssets = (db: GameEditorDatabase) => async (savedDesign: SavedDesignKey = 'quit-save') => {
    const allKeys = await db.getAllKeysFromIndex('sound-assets', 'by-design-key', savedDesign)
    const tx = db.transaction('sound-assets', 'readwrite', {})

    return await Promise.all([
        ...allKeys.map(key => {
            tx.store.delete(key)
        }),
        tx.done
    ])
}

export const retrieveSoundAssets = (db: GameEditorDatabase) => (savedDesign: SavedDesignKey = 'quit-save') => {
    return db.getAllFromIndex('sound-assets', 'by-design-key', savedDesign)
}
