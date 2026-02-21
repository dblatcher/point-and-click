import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { usePageMeta } from '@/context/page-meta-context'
import { gameDesign, imageAssets, soundAssets } from '@/data/test-game'
import { Typography } from '@mui/material'
import { useEffect } from 'react'
import { TextBasedLayout } from '../layouts/text-venture/TextBasedLayout'


export const TextBasedPlayer = () => {

    const { setHeaderContent } = usePageMeta()

    useEffect(
        () => {
            setHeaderContent(<Typography>Text based mode</Typography>)
        }, [setHeaderContent]
    )

    return (
        <GameDesignPlayer
            gameDesign={gameDesign}
            imageAssets={imageAssets}
            soundAssets={soundAssets}
            uiComponents={{
                GameLayoutComponent: TextBasedLayout
            }}
            instantMode
        />
    )
}