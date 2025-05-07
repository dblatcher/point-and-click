import { ImageAssetSchema, SoundAssetSchema } from "@/services/assets"
import { z } from "zod"
import { parseAndUpgrade } from "../design-version-management"
import { DB_VERSION } from "../indexed-db"


const designAndAssetsSchema = z.object({
  gameDesign: z.unknown(),
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

  const { design, message } = parseAndUpgrade(dataParse.data.gameDesign, DB_VERSION)

  if (!design) {
    console.error(message)
    throw (new Error('failed to parse loaded game design'))
  }

  return {
    ...dataParse.data,
    gameDesign: design,
  }
}
