import { ImageAssetSchema, SoundAssetSchema } from "@/services/assets"
import { z } from "zod"
import { parseAndUpgrade } from "../design-version-management"
import { GameDesignSchema } from "@/definitions/Game"


const unparsedDesignAndAssetsSchema = z.object({
  gameDesign: z.unknown(),
  imageAssets: ImageAssetSchema.array(),
  soundAssets: SoundAssetSchema.array(),
})

const designAndAssetsSchema = z.object({
  gameDesign: GameDesignSchema,
  imageAssets: ImageAssetSchema.array(),
  soundAssets: SoundAssetSchema.array(),
})

export type DesignAndAssets = z.infer<typeof designAndAssetsSchema>

export const getGameFromApi = async (): Promise<DesignAndAssets> => {
  const response = await fetch('/api/game')
  const json = await response.json()
  const dataParse = unparsedDesignAndAssetsSchema.safeParse(json)
  if (!dataParse.success) {
    console.error(dataParse.error.issues)
    throw (new Error('failed to parse loaded game data'))
  }

  const designParse = parseAndUpgrade(dataParse.data.gameDesign)

  if (!designParse.success) {
    console.error(designParse.failureMessage)
    throw (new Error('failed to parse loaded game design'))
  }

  return {
    ...dataParse.data,
    gameDesign: designParse.gameDesign,
  }
}
