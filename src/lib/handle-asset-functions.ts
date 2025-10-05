import { deleteAllImageAssets, deleteAllSoundAssets, deleteImageAsset, deleteSoundAsset, GameEditorDatabase, storeImageAsset, storeSoundAsset } from '@/lib/indexed-db';
import { AssetServiceUpdate } from '@/services/FileAssetService';
import { ImageService } from '@/services/imageService';
import { SoundService } from '@/services/soundService';


export const storeImageUpdateToQuitSaveFunction = (imageService: ImageService, db: GameEditorDatabase) => (update: AssetServiceUpdate) => {

    if (update.source === 'DB_QUIT_SAVE') {
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

export const handleSoundUpdateToQuitSaveFunction = (soundService: SoundService, db: GameEditorDatabase) => (update: AssetServiceUpdate) => {

    if (update.source === 'DB_QUIT_SAVE') {
        return
    }

    const storeFromIds = (ids: string[]) => {
        ids.forEach(id => {
            soundService.getWithFile(id).then(({ asset, file }) => {
                if (asset && file) {
                    storeSoundAsset(db)(asset, file)
                }
            })
        })
    }

    if (update.action === 'populate') {
        Promise.all([
            deleteAllSoundAssets(db)()
        ]).then(() => {
            storeFromIds(update.ids)
        })
    }

    if (update.action === 'add') {
        storeFromIds(update.ids)
    }

    if (update.action === 'remove') {
        update.ids.forEach(id => {
            deleteSoundAsset(db)(id)
        })
    }
}
