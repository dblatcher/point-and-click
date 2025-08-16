
import { ActorData, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { FileAssetSelector } from "../FileAssetSelector";
import { SpritePreview } from "../SpritePreview";
import { AnimationFrameList } from "./AnimationFrameList";

interface Props {
    selectedDirection?: Direction
    selectedAnimation?: string
    overrideSprite: Sprite
    actorData?: ActorData
    spriteData: SpriteData
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    close: { (): void };
}

const getDefaultingMessage = (
    animationSet: Record<string, SpriteFrame[] | undefined> | undefined,
    animationSetForDirection: SpriteFrame[] | undefined,
    defaultDirection: Direction,
    selectedDirection: Direction,
) => {

    const noFramesForDirection = !animationSetForDirection?.length;
    const noFrameForDefault = !animationSet || !animationSet[defaultDirection]?.length;
    const isDefault = selectedDirection === defaultDirection;

    if (isDefault) {
        if (noFrameForDefault) {
            return (
                <Alert severity="info" sx={{ maxWidth: 200 }}>
                    No frames are set for {selectedDirection}, so the default animation is shown.
                </Alert>
            )
        }
    } else if (noFramesForDirection) {
        if (noFrameForDefault) {
            return <Alert severity="info" sx={{ maxWidth: 200 }}>
                No frames are set for {selectedDirection} or the sprites default direction ({defaultDirection}), so the default animation is shown.
            </Alert>
        }
        return <Alert severity="info" sx={{ maxWidth: 200 }}>
            No frames for {selectedDirection}, so the default direction ({defaultDirection}) is used.
        </Alert>
    }
    return null
}

export const AnimationDialog = ({
    selectedAnimation,
    selectedDirection,
    overrideSprite,
    spriteData,
    actorData,
    editCycle,
    close,
}: Props) => {
    const [selectedSheetId, setSelectedSheetId] = useState<string>();
    const { defaultDirection, animations } = spriteData
    const animationSet = selectedAnimation ? animations[selectedAnimation] : undefined;
    const animationSetForDirection = animationSet && selectedDirection ? animationSet[selectedDirection] : undefined;

    return (
        <Dialog maxWidth={'xl'}
            scroll="paper"
            open={!!selectedAnimation && !!selectedDirection}
            onClose={close}
            PaperProps={{
                sx: { height: 'calc(100% - 64px)' }
            }}
        >

            {(selectedAnimation && selectedDirection && actorData) && (<>
                <DialogTitle>
                    Set Frames: {selectedAnimation}/{selectedDirection}{selectedDirection === defaultDirection && <span>(default)</span>}
                </DialogTitle>

                <DialogContent sx={{ display: 'flex', gap: 4, minHeight: 'calc(100% - 164px)' }}>
                    <Box position={'sticky'} top={1} overflow={'auto'}>
                        <FileAssetSelector assetType="image"
                            legend="sprite sheet"
                            format="select"
                            filterItems={(item) => item.category === 'spriteSheet' || item.category === 'any'}
                            selectedItemId={selectedSheetId}
                            select={(asset): void => { setSelectedSheetId(asset.id) }} />
                        <SpritePreview
                            noBaseLine
                            scale={2}
                            overrideSprite={overrideSprite}
                            data={actorData}
                        />
                        {getDefaultingMessage(
                            animationSet,
                            animationSetForDirection,
                            defaultDirection,
                            selectedDirection,
                        )}
                    </Box>

                    {(animationSet) && (
                        <AnimationFrameList animKey={selectedAnimation}
                            defaultDirection={defaultDirection}
                            direction={selectedDirection}
                            animation={animationSet}
                            editCycle={editCycle}
                            setSelectedSheetId={setSelectedSheetId}
                            imageId={selectedSheetId}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    {(animationSetForDirection && selectedDirection !== defaultDirection) && (
                        <ButtonWithConfirm
                            label={`Delete animation "${selectedAnimation} (${selectedDirection})"`}
                            onClick={() => editCycle(selectedAnimation, selectedDirection, undefined)} />
                    )}
                    <Button onClick={close}>close</Button>
                </DialogActions>
            </>)}
        </Dialog>
    )
}