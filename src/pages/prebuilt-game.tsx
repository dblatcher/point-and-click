import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { PageLayout } from '@/components/PageLayout'
import { bigLayoutSet } from '@/components/game-mui-ux'
import { DesignAndAssets, getGameFromApi } from '@/lib/api-usage'
import { useEffect, useState } from 'react'


export default function GameLoaderPage() {
  const [data, setData] = useState<DesignAndAssets | undefined>()
  const [loadError, setLoadError] = useState<Error | undefined>()

  useEffect(() => {
    getGameFromApi().then(setData).catch(setLoadError)
  }, [setData, setLoadError])

  return (
    <PageLayout noPageScroll>

      {loadError && <p>ERROR: {loadError.message}</p>}

      {data ?
        <GameDesignPlayer
          gameDesign={data.gameDesign}
          imageAssets={data.imageAssets}
          soundAssets={data.soundAssets}
          uiComponents={bigLayoutSet}
        /> : null}
    </PageLayout>
  )
}
