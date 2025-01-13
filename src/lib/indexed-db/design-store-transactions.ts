import { GameDesign } from "@/definitions";
import { GameEditorDatabase, SavedDesignKey } from "./types";

const listSavedDesignKeys = (db:GameEditorDatabase) => () => {
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

export const retrieveAllSavedDesigns = (db: GameEditorDatabase) => async () => {
    const designKeys = (await listSavedDesignKeys(db)()).filter(key => key !== 'quit-save')
    const uncheckedResults = await Promise.all(
        designKeys.map(key => retrieveSavedDesign(db)(key))
    );
    const validResults: { design: GameDesign, timestamp: number }[] = uncheckedResults
        .flatMap(({ design, timestamp = 0 }) => design ? { design, timestamp } : []);

    return validResults.map((result, index) => ({ ...result, key: designKeys[index] }))
}