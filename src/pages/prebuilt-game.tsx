import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { prebuiltGameDesign } from '@/data/fullGame'
import { imageAssets } from '@/data/images'
import { soundAssets } from '@/data/sounds'
import { PageLayout } from '@/components/PageLayout'
// import { bigLayoutSet } from '@/components/game-mui-ux'
import { FullScreenLayout } from '@/components/full-screen-ui/FullScreenLayout'


export default function GameLoaderPage() {
  return (
    <PageLayout noPageScroll>
      <GameDesignPlayer
        gameDesign={prebuiltGameDesign}
        imageAssets={imageAssets}
        soundAssets={soundAssets}
        uiComponents={{ GameLayoutComponent: FullScreenLayout }}
      />
    </PageLayout>
  )
}
