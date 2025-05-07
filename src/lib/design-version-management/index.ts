import { GameDesign } from "@/definitions";
import { V2GameDesign, v2GameDesignSchema } from "@/definitions/old-versions/v2";
import { GameDesignSchema } from "@/definitions/Game";


export const migrateV2Design = (v2Design: V2GameDesign, schemaVersion: number): GameDesign => {
    return {
        ...v2Design,
        storyBoards: v2Design.storyBoards ?? [],
        schemaVersion,
    }
}

export const parseAndUpgrade = (maybeGameDesign: unknown, schemaVersion: number): { design?: GameDesign, message?: string } => {

    const parseResult = GameDesignSchema.safeParse(maybeGameDesign);
    if (parseResult.success) {
        return ({
            design: parseResult.data
        })
    }

    const v2ParseResult = v2GameDesignSchema.safeParse(maybeGameDesign);
    if (v2ParseResult.success) {
        return ({
            design: migrateV2Design(v2ParseResult.data, schemaVersion),
            message: 'upgraded from v2 design'
        })
    }

    return {
        message: parseResult.error.message
    }
}
