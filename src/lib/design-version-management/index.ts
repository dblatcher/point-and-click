import { GameDesign } from "@/definitions";
import { V2GameDesign, v2GameDesignSchema } from "@/definitions/old-versions/v2";
import { GameDesignSchema } from "@/definitions/Game";
import { DB_VERSION } from "../indexed-db";

export const migrateV2Design = (v2Design: V2GameDesign, schemaVersion: number): GameDesign => {
    return {
        ...v2Design,
        storyBoards: v2Design.storyBoards ?? [],
        schemaVersion,
    }
}

export const parseAndUpgrade = (maybeGameDesign: unknown): { gameDesign?: GameDesign, message?: string } => {

    const parseResult = GameDesignSchema.safeParse(maybeGameDesign);
    if (parseResult.success) {
        return ({
            gameDesign: parseResult.data
        })
    }

    const v2ParseResult = v2GameDesignSchema.safeParse(maybeGameDesign);
    if (v2ParseResult.success) {
        return ({
            gameDesign: migrateV2Design(v2ParseResult.data, DB_VERSION),
            message: 'upgraded from v2 design'
        })
    }

    return {
        message: parseResult.error.message
    }
}
