import { DBSchema, deleteDB, IDBPDatabase, openDB } from "idb";

export const DB_NAME = 'Point-and-click-db'
export const DB_VERSION = 2


type KeyStoreKey = 'update-timestamp'

export interface MyDB extends DBSchema {
    'key-store': {
        key: KeyStoreKey;
        value: number;
    };
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
            db.createObjectStore('key-store');

            const productStore = db.createObjectStore('products', {
                keyPath: 'productCode',
            });
            productStore.createIndex('by-price', 'price');
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
