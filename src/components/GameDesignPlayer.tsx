import { Game } from "@/components/game/Game";
import { AssetsProvider } from "@/context/asset-context";
import { CELL_SIZE, DEFAULT_TALK_TIME } from "@/lib/types-and-constants";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";
import { Box, Skeleton } from "@mui/material";
import { GameRunner } from "point-click-components";
import { GameDesign } from "point-click-lib";
import { useEffect, useRef, useState } from "react";
import { UiComponentSet } from "./game/uiComponentSet";
import { BasicLayout } from "./layouts-for-runner/BasicLayout";


type Props = {
  gameDesign: GameDesign;
  imageAssets: ImageAsset[];
  soundAssets: SoundAsset[];
  uiComponents?: UiComponentSet;
  instantMode?: boolean;
}
const usingGameRunner = false as boolean;

export const GameDesignPlayer = ({
  uiComponents,
  instantMode,
  gameDesign,
  imageAssets,
  soundAssets
}: Props) => {
  const soundServiceRef = useRef(new SoundService())
  const imageServiceRef = useRef(new ImageService())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { current: soundService } = soundServiceRef;
    const { current: imageService } = imageServiceRef;

    Promise.all([
      soundService.populate(soundAssets),
      imageService.populate(imageAssets),
    ])
      .then(() => {
        setReady(true)
      })

    return () => {
      soundService.populate([]);
      imageService.populate([]);
      setReady(false)
    }
  }, [gameDesign, imageAssets, soundAssets])

  return (
    <AssetsProvider imageService={imageServiceRef.current} soundService={soundServiceRef.current}>
      {(ready) ? (
        <>
          {(usingGameRunner)
            ? <GameRunner
              gameDesign={gameDesign}
              getImageAsset={id => imageServiceRef.current.get(id)}
              getSoundAsset={id => soundServiceRef.current.get(id)}
              Layout={BasicLayout}
              options={{
                cellSize: CELL_SIZE,
                playSound: (soundId, volume) => !!soundServiceRef.current.play(soundId, { volume })
              }}
            />
            : <Game
              {...gameDesign}
              uiComponents={uiComponents}
              instantMode={instantMode}
              playSound={(soundId, volume) => !!soundServiceRef.current.play(soundId, { volume })}
              cellSize={CELL_SIZE}
              defaultTalkTime={DEFAULT_TALK_TIME}
              allowLocalSaves
            />
          }
        </>
      ) : (
        <Box padding={3} flex={1} display={'flex'} flexDirection={'column'} gap={1}>
          <Skeleton variant="rectangular" sx={{ flex: 3 }}></Skeleton>
          <Skeleton variant="rectangular" sx={{ flex: 1 }}></Skeleton>
        </Box>
      )}
    </AssetsProvider>
  )
}
