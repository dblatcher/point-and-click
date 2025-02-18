import { GameDesignSchema } from "@/definitions/Game"
import { ImageAssetSchema, SoundAssetSchema } from "@/services/assets"
import { z } from "zod"


const designAndAssetsSchema = z.object({
  gameDesign: GameDesignSchema,
  imageAssets: ImageAssetSchema.array(),
  soundAssets: SoundAssetSchema.array(),
})

export type DesignAndAssets = z.infer<typeof designAndAssetsSchema>

export const getGameFromApi = async (): Promise<DesignAndAssets> => {
  const response = await fetch('/api/game')
  const json = await response.json()
  const dataParse = designAndAssetsSchema.safeParse(json)
  if (!dataParse.success) {
    console.error(dataParse.error.issues)
    throw (new Error('failed to parse loaded game data'))
  }
  return dataParse.data
}
