import { deleteDB, openDB } from "idb";
import { GameEditorDatabase, GameEditorDBSchema } from "./types";
import { DB_VERSION as VERSION_FROM_LIB} from "point-click-lib"

const DB_NAME = 'Point-and-click-db'
export const DB_VERSION = VERSION_FROM_LIB

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
        async upgrade(
            db,
            oldVersion,
        ) {

            // no old DB
            if (oldVersion === 0) {
                console.log('creating new DB')
                db.createObjectStore('designs');
                const imageAssetStore = db.createObjectStore('image-assets');
                imageAssetStore.createIndex('by-design-key', 'savedDesign')
                const soundAssetStore = db.createObjectStore('sound-assets');
                soundAssetStore.createIndex('by-design-key', 'savedDesign')
                return
            }

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

    return { db }
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