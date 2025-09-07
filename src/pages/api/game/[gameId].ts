// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as testGame from '@/data/test-game'
import * as simpleTemplate from '@/data/simple-template'
import type { DesignAndAssets, ValidGameId } from '@/lib/api-usage'
import type { NextApiRequest, NextApiResponse } from 'next'

const gameDataMap: Record<string, DesignAndAssets | undefined> = {
    test: testGame,
    "simple-template": simpleTemplate,
} satisfies Record<ValidGameId, DesignAndAssets>

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<DesignAndAssets | string>
) {
    const { gameId } = req.query;
    if (typeof gameId !== 'string') {
        return res.status(400).json('BAD PARAM')
    }
    const designAndAssets = gameDataMap[gameId];
    
    if (!designAndAssets) {
        return res.status(400).json('BAD PARAM')
    }

    res.status(200).json(designAndAssets)
}
