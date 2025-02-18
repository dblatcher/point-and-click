// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prebuiltGameDesign } from '@/data/fullGame'
import { imageAssets } from '@/data/images'
import { soundAssets } from '@/data/sounds'
import { DesignAndAssets } from '@/lib/api-usage'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<DesignAndAssets>
) {
    res.status(200).json({
        gameDesign: prebuiltGameDesign,
        imageAssets,
        soundAssets,
    })
}
