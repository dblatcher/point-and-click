import { deleteDB, openDB } from "idb";
import { GameEditorDatabase, GameEditorDBSchema } from "./types";


export const DB_NAME = 'Point-and-click-db'
export const DB_VERSION = 2

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
    const db = await openDB<GameEditorDBSchema>(DB_NAME, DB_VERSION, {
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
            const soundAssetStore = db.createObjectStore('sound-assets');
            soundAssetStore.createIndex('by-design-key', 'savedDesign')
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

export * from './transactions';
export * from './types';
