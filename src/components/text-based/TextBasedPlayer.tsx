import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { usePageMeta } from '@/context/page-meta-context'
import { gameDesign, imageAssets, soundAssets } from '@/data/test-game'
import { useEffect } from 'react'
import { TextBasedLayout } from './TextBasedLayout'


export const TextBasedPlayer = () => {

    const { setHeaderContent } = usePageMeta()

    useEffect(
        () => {
            setHeaderContent(<p>Text based mode</p>)
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