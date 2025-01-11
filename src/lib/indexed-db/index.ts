import { GameDesign } from "@/definitions";
import { ImageAsset } from "@/services/assets";
import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb";

export const DB_NAME = 'Point-and-click-db'
export const DB_VERSION = 1


type SavedDesignKey = 'quit-save'

export interface MyDB extends DBSchema {
    'designs': {
        key: SavedDesignKey;
        value: {
            design: GameDesign,
            timestamp: number,
        };
    };
    'image-assets': {
        key: string;
        value: {
            savedDesign: SavedDesignKey;
            asset: ImageAsset;
            file: File;
        }
        indexes: { 'by-design-key': SavedDesignKey }
    };
}

export type GameEditorDatabase = IDBPDatabase<MyDB>;

type WindowPlus = Window & {
    MY_DATABASE?: GameEditorDatabase,
    deleteMyDatabase?: { (): Promise<void> }
}

const putStuffOnWindow = (db: GameEditorDatabase) => {
    const windowPlus = window as unknown as WindowPlus
    windowPlus.MY_DATABASE = db
    windowPlus.deleteMyDatabase = deleteDatabase(db)
}


export const openDataBaseConnection = async () => {
    const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
        upgrade(
            db,
            oldVersion,
            // newVersion,
            // transaction,
            // event
        ) {
            console.log('running upgrade', { oldVersion })
            db.createObjectStore('designs');
            const imageAssetStore = db.createObjectStore('image-assets');
            imageAssetStore.createIndex('by-design-key', 'savedDesign')

        },
        blocked(currentVersion, blockedVersion, event) {
            console.warn('open db blocked', { currentVersion, blockedVersion, event })
        },
        blocking(currentVersion, blockedVersion, event) {
            console.warn('open db blocking', { currentVersion, blockedVersion, event })
        },
        terminated() {
            console.warn('open db terminated')
        },
    });

    putStuffOnWindow(db)
    return db
}

export const deleteDatabase = (db: GameEditorDatabase) => () => {
    db.close()
    return deleteDB(DB_NAME, {
        blocked: (currentVersion) => {
            console.warn('COULD NOT DELETE DB', { currentVersion })
        }
    }).then(() => {
        console.log('DB DELETED')
    }).catch((err) => {
        console.warn('DB DELETED FAILED!!', err)
    })
}


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

export const retrieveImageAssets = (db: GameEditorDatabase) => () => {
    return db.getAllFromIndex('image-assets', 'by-design-key', 'quit-save')
}
