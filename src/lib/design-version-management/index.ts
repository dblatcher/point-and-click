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

type DesignParseResult = {
    success: true,
    gameDesign: GameDesign,
    sourceVersion: number,
    failureMessage?: undefined,
    updated?: boolean,
} | {
    success: false,
    gameDesign?: undefined,
    sourceVersion?: number,
    failureMessage?: string,
    updated?: boolean,
}

export const parseAndUpgrade = (maybeGameDesign: unknown): DesignParseResult => {

    const parseResult = GameDesignSchema.safeParse(maybeGameDesign);
    if (parseResult.success) {
        return ({
            success: true,
            gameDesign: parseResult.data,
            sourceVersion: DB_VERSION,
            updated: false,
        })
    }

    const v2ParseResult = v2GameDesignSchema.safeParse(maybeGameDesign);
    if (v2ParseResult.success) {
        return ({
            success: true,
            gameDesign: migrateV2Design(v2ParseResult.data, DB_VERSION),
            sourceVersion: 2,
            updated: true,
        })
    }

    return {
        success: false,
        failureMessage: v2ParseResult.error.message
    }
}
