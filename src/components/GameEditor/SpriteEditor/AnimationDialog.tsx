
import { ActorData, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { SpritePreview } from "../SpritePreview";
import { AnimationFrameList } from "./AnimationFrameList";
import { FramePicker } from "./FramePicker";

interface Props {
    selectedDirection?: Direction
    selectedAnimation?: string
    overrideSprite: Sprite
    actorData?: ActorData
    spriteData: SpriteData

    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;

    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    pickFrame: { (row: number, col: number, sheetId?: string): void };
    close: { (): void };
}

export const AnimationDialog = ({
    selectedAnimation,
    selectedDirection,
    overrideSprite,
    selectedRow,
    selectedCol,
    selectedSheetId,
    spriteData,
    actorData,
    editCycle,
    pickFrame,
    close,
}: Props) => {

    const { defaultDirection, animations } = spriteData

    const animationSet = selectedAnimation ? animations[selectedAnimation] : undefined;
    const animationSetForDirection = animationSet && selectedDirection ? animationSet[selectedDirection] : undefined;

    return (

        <Dialog fullWidth maxWidth={'xl'}
            scroll="paper"
            open={!!selectedAnimation && !!selectedDirection}
            onClose={close}>

            {(selectedAnimation && selectedDirection && actorData) && (<>

                <DialogTitle>
                    {selectedAnimation}/{selectedDirection}{selectedDirection === defaultDirection && <span>(default)</span>}
                </DialogTitle>

                <DialogContent sx={{ display: 'flex', justifyContent: 'space-between' }}>


                    <Box position={'sticky'} top={1} overflow={'auto'}>
                        <FramePicker
                            pickFrame={pickFrame}
                            sheetId={selectedSheetId}
                            row={selectedRow}
                            col={selectedCol} />
                    </Box>


                    {(animationSet) && (
                        <AnimationFrameList animKey={selectedAnimation}
                            defaultDirection={defaultDirection}
                            direction={selectedDirection}
                            animation={animationSet}
                            editCycle={editCycle}
                            pickFrame={pickFrame}
                            selectedFrame={selectedSheetId ? {
                                row: selectedRow,
                                col: selectedCol,
                                imageId: selectedSheetId,
                            } : undefined}
                        />
                    )}

                    <Box position={'sticky'} top={1}>
                        <SpritePreview
                            noBaseLine
                            scale={2}
                            overrideSprite={overrideSprite}
                            data={actorData}
                        />
                    </Box>
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