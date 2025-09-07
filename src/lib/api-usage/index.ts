import { GameDesignSchema } from "@/definitions/Game"
import { ImageAssetSchema, SoundAssetSchema } from "@/services/assets"
import { z } from "zod"
import { parseAndUpgrade } from "../design-version-management"


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

const validGameId = z.enum([
  'test',
]);
export type ValidGameId = z.infer<typeof validGameId>;


type ApiGameResult = {
  success: true,
  data: DesignAndAssets,
  failureMessage?: undefined,
} | {
  success: false,
  data?: undefined,
  failureMessage: string,
}


const fetchGameJson = async (gameId: ValidGameId): Promise<unknown | undefined> => {
  try {
    const response = await fetch(`/api/game/${gameId}`);
    if (!response.ok) {
      console.error(`fetch json got ${response.status} (${response.statusText}) response`);
      return undefined
    }
    return await response.json();
  } catch (err) {
    console.error('fetch json failed', err)
    return undefined
  }
}

export const getGameFromApi = async (gameId: ValidGameId): Promise<ApiGameResult> => {

  if (!validGameId.safeParse(gameId).success) {
    return {
      success: false,
      failureMessage: `invalid game id`
    }
  }

  const json = await fetchGameJson(gameId);
  if (!json) {
    return {
      success: false,
      failureMessage: `failed to fetch data from server.`
    }
  }

  const dataParse = unparsedDesignAndAssetsSchema.safeParse(json)
  if (!dataParse.success) {
    console.error(dataParse.error.issues)
    return {
      success: false,
      failureMessage: `failed to parse loaded game data: ${dataParse.error.message}`
    }
  }

  const designParseResult = parseAndUpgrade(dataParse.data.gameDesign)
  if (!designParseResult.success) {
    console.error(designParseResult.failureMessage)
    return {
      success: false,
      failureMessage: 'failed to parse loaded game design'
    }
  }

  return {
    success: true,
    data: {
      ...dataParse.data,
      gameDesign: designParseResult.gameDesign,
    }
  }
}
