import { GameDesign, V2GameDesign } from "point-click-lib";
import { GameEditorDatabase, SavedDesignKey } from "./types";

const listSavedDesignKeys = (db: GameEditorDatabase) => () => {
    return db.getAllKeys('designs')
}

export const storeSavedDesign = (db: GameEditorDatabase) => (design: GameDesign, savedDesign: SavedDesignKey = 'quit-save') => {
    return db.put('designs', { design, timestamp: Date.now() }, savedDesign)
}

export const retrieveSavedDesign = (db: GameEditorDatabase) => (savedDesign: SavedDesignKey = 'quit-save'): Promise<{
    design?: GameDesign | V2GameDesign;
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
    return db.delete('designs', savedDesign)
}

export const retrieveAllSavedDesigns = (db: GameEditorDatabase) => async (includeQuitSave = false) => {
    const designKeys = includeQuitSave
        ? await listSavedDesignKeys(db)()
        : (await listSavedDesignKeys(db)()).filter(key => key !== 'quit-save');

    const uncheckedResults = await Promise.all(
        designKeys.map(key => retrieveSavedDesign(db)(key))
    );
    const validResults: { design: GameDesign | V2GameDesign, timestamp: number }[] = uncheckedResults
        .flatMap(({ design, timestamp = 0 }) => design ? { design, timestamp } : []);

    return validResults.map((result, index) => ({ ...result, key: designKeys[index] }))
}