import { V2GameDesign } from "@/definitions/old-versions/v2";
import { migrateV2Design } from "@/lib/design-version-management";
import { retrieveAllSavedDesigns, storeSavedDesign } from "./design-store-transactions";
import { GameEditorDatabase } from "./types";


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
