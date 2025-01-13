import { deleteAllImageAssets, deleteAllSoundAssets, deleteImageAsset, deleteSoundAsset, GameEditorDatabase, storeImageAsset, storeSoundAsset } from '@/lib/indexed-db';
import { AssetServiceUpdate } from '@/services/FileAssetService';
import { ImageService } from '@/services/imageService';
import { SoundService } from '@/services/soundService';


export const handleImageUpdateFunction = (imageService: ImageService, db?: GameEditorDatabase,) => (update: AssetServiceUpdate) => {
    console.log('an image update', update)
    if (!db) { return }

    if (update.source === 'DB') {
        return
    }

    const storeFromIds = (ids: string[]) => {
        ids.forEach(id => {
            imageService.getWithFile(id).then(({ asset, file }) => {
                if (asset && file) {
                    storeImageAsset(db)(asset, file)
                }
            })
        })
    }

    if (update.action === 'populate') {
        Promise.all([
            deleteAllImageAssets(db)()
        ]).then(() => {
            storeFromIds(update.ids)
        })
    }

    if (update.action === 'add') {
        storeFromIds(update.ids)
    }

    if (update.action === 'remove') {
        update.ids.forEach(id => {
            deleteImageAsset(db)(id)
        })
    }
}

export const handleSoundUpdateFunction = (soundService: SoundService, db?: GameEditorDatabase,) => (update: AssetServiceUpdate) => {
    console.log('an sound update', update)
    if (!db) { return }

    if (update.source === 'DB') {
        return
    }

    if (update.action === 'populate') {
        Promise.all([
            deleteAllSoundAssets(db)()
        ]).then(() => {
            update.ids.forEach(id => {
                soundService.getWithFile(id).then(({ asset, file }) => {
                    if (asset && file) {
                        storeSoundAsset(db)(asset, file)
                    }
                })
            })
        })
    }

    if (update.action === 'add') {
        update.ids.forEach(id => {
            soundService.getWithFile(id).then(({ asset, file }) => {
                if (asset && file) {
                    storeSoundAsset(db)(asset, file)
                }
            })
        })
    }

    if (update.action === 'remove') {
        update.ids.forEach(id => {
            deleteSoundAsset(db)(id)
        })
    }
}
