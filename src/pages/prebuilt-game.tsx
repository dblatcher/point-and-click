import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { prebuiltGameDesign } from '@/data/fullGame'
import { imageAssets } from '@/data/images'
import { soundAssets } from '@/data/sounds'
import { PageLayout } from '@/components/PageLayout'


export default function GameLoaderPage() {
  return (
    <PageLayout>
      <GameDesignPlayer
        gameDesign={prebuiltGameDesign}
        imageAssets={imageAssets}
        soundAssets={soundAssets}
      />
    </PageLayout>
  )
}
