import { Game } from "@/components/game/Game";
import { AssetsProvider } from "@/context/asset-context";
import { SpritesProvider } from "@/context/sprite-context";
import { Sprite } from "@/lib/Sprite";
import { CELL_SIZE, DEFAULT_TALK_TIME } from "@/lib/types-and-constants";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";
import { Box, Skeleton } from "@mui/material";
import { GameDesign } from "point-click-lib";
import { useEffect, useRef, useState } from "react";
import { UiComponentSet } from "./game/uiComponentSet";

type Props = {
  gameDesign: GameDesign;
  imageAssets: ImageAsset[];
  soundAssets: SoundAsset[];
  uiComponents?: UiComponentSet;
  instantMode?: boolean;
}

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
  const [sprites, setSprites] = useState<Sprite[]>([])

  useEffect(() => {
    const { current: soundService } = soundServiceRef;
    const { current: imageService } = imageServiceRef;
    setSprites([...gameDesign.sprites.map((data) => new Sprite(data, imageService.get.bind(imageService)))]);

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
      <SpritesProvider value={sprites}>
        {(ready) ? (
          <Game
            {...gameDesign}
            uiComponents={uiComponents}
            instantMode={instantMode}
            playSound={(soundId, volume) => !!soundServiceRef.current.play(soundId, { volume })}
            cellSize={CELL_SIZE}
            defaultTalkTime={DEFAULT_TALK_TIME}
            allowLocalSaves
          />
        ) : (
          <Box padding={3} flex={1} display={'flex'} flexDirection={'column'} gap={1}>
            <Skeleton variant="rectangular" sx={{ flex: 3 }}></Skeleton>
            <Skeleton variant="rectangular" sx={{ flex: 1 }}></Skeleton>
          </Box>
        )}
      </SpritesProvider>
    </AssetsProvider>
  )
}
