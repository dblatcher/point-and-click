import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { usePageMeta } from '@/context/page-meta-context'
import { prebuiltGameDesign } from '@/data/fullGame'
import { imageAssets } from '@/data/images'
import { soundAssets } from '@/data/sounds'
import { useEffect } from 'react'
import { UiComponentSet } from '../game/uiComponentSet'
import { TextBasedLayout } from './TextBasedLayout'


const ui:UiComponentSet = {
    GameLayoutComponent:TextBasedLayout
}

export const TextBasedPlayer = () => {

    const { setHeaderContent } = usePageMeta()

    useEffect(
        () => {
            setHeaderContent(<p>Text based mode</p>)
        }, [setHeaderContent]
    )

    return (
        <GameDesignPlayer
            gameDesign={prebuiltGameDesign}
            imageAssets={imageAssets}
            soundAssets={soundAssets}
            uiComponents={ui}
        />
    )
}