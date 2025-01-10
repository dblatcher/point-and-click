import { GameDesign } from "@/definitions";
import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb";

export const DB_NAME = 'Point-and-click-db'
export const DB_VERSION = 3


type KeyStoreKey = 'update-timestamp'
type DesignStoreKey = 'quit-save'

export interface MyDB extends DBSchema {
    'key-store': {
        key: KeyStoreKey;
        value: number;
    };
    'designs': {
        key: DesignStoreKey;
        value: {
            design: GameDesign,
            timestamp: number,
        };
    }
    products: {
        value: {
            name: string;
            price: number;
            productCode: string;
        };
        key: string;
        indexes: { 'by-price': number };
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
            if (oldVersion < 1) {
                db.createObjectStore('key-store');
                const productStore = db.createObjectStore('products', {
                    keyPath: 'productCode',
                });
                productStore.createIndex('by-price', 'price');
            }

            db.createObjectStore('designs');

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

export const keyStoreUpdate = (db: GameEditorDatabase) => (key: KeyStoreKey, value: number) => {
    return db.put('key-store', value, key)
}

export const getKeyStoreValue = (db: GameEditorDatabase) => (key: KeyStoreKey) => {
    return db.get('key-store', key)
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

