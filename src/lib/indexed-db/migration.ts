import { GameDesign } from "@/definitions";
import { V2GameDesign } from "@/definitions/old-versions/v2";
import { retrieveAllSavedDesigns, storeSavedDesign } from "./design-store-transactions";
import { GameEditorDatabase } from "./types";


const migrateV2Design = (v2Design: V2GameDesign, schemaVersion: number): GameDesign => {
    return {
        ...v2Design,
        schemaVersion,
    }
}


export const migrateData = (db: GameEditorDatabase) => async (oldVersion: number, newVersion: number) => {
    const v2Designs = await retrieveAllSavedDesigns(db)(true);

    console.log('running data migration', { oldVersion, newVersion })
    return Promise.all(
        v2Designs.map(record => {
            const v2Design = record.design as V2GameDesign;
            storeSavedDesign(db)(migrateV2Design(v2Design, newVersion), record.key)
        })
    )
}
