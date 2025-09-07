import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { PageLayout } from '@/components/PageLayout'
import { BigLayout } from '@/components/game-mui-ux/BigLayout'
import { DesignAndAssets, getGameFromApi } from '@/lib/api-usage'
import { useEffect, useState } from 'react'


export default function GameLoaderPage() {
  const [data, setData] = useState<DesignAndAssets | undefined>()
  const [loadError, setLoadError] = useState<string | undefined>()

  useEffect(() => {
    getGameFromApi('test').then(result => {
      if (!result.success) {
        return setLoadError(result.failureMessage)
      }
      setLoadError(undefined);
      return setData(result.data)
    }
    ).catch((err: Error) => setLoadError(err.message))
  }, [setData, setLoadError])

  return (
    <PageLayout noPageScroll>

      {loadError && <p>ERROR: {loadError}</p>}

      {data ?
        <GameDesignPlayer
          gameDesign={data.gameDesign}
          imageAssets={data.imageAssets}
          soundAssets={data.soundAssets}
          uiComponents={{
            GameLayoutComponent: BigLayout,
          }}
        /> : null}
    </PageLayout>
  )
}
