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

type ApiGameResult = {
  success: true,
  data: DesignAndAssets,
  failureMessage?: undefined,
} | {
  success: false,
  data?: undefined,
  failureMessage: string,
}


const fetchOkJson = async (input: RequestInfo | URL, init?: RequestInit): Promise<unknown | undefined> => {
  try {
    const response = await fetch(input, init);
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

export const getGameFromApi = async (): Promise<ApiGameResult> => {

  const json = await fetchOkJson('/api/game');
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
