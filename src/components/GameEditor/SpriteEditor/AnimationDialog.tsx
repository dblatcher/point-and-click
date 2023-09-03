
import { ActorData, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Container, Grid, Stack } from "@mui/material";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { SpritePreview } from "../SpritePreview";
import { AnimationFrameList } from "./AnimationFrameList";
import { FramePicker2 } from "./FramePicker2";

interface Props {
    selectedDirection: Direction
    selectedAnimation: string
    overrideSprite: Sprite
    actorData: ActorData
    spriteData: SpriteData

    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;

    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    pickFrame: { (row: number, col: number, sheetId?: string): void };
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
}: Props) => {

    const { defaultDirection, animations } = spriteData

    return (
        <Container>
            <Stack direction={'row'} spacing={2}>
                <Stack spacing={2} flex={1}>
                    <Grid item xs={6}>
                        <SpritePreview
                            noBaseLine
                            scale={3}
                            overrideSprite={overrideSprite}
                            data={actorData}
                        />
                    </Grid>

                    {(animations[selectedAnimation]?.[selectedDirection] && selectedDirection !== defaultDirection) && (
                        <ButtonWithConfirm
                            label={`Delete animation "${selectedAnimation} (${selectedDirection})"`}
                            onClick={() => editCycle(selectedAnimation, selectedDirection, undefined)} />
                    )}

                    <FramePicker2
                        pickFrame={pickFrame}
                        sheetId={selectedSheetId}
                        row={selectedRow}
                        col={selectedCol}
                    />
                </Stack>

                {(animations[selectedAnimation]) && (
                    <AnimationFrameList animKey={selectedAnimation}
                        defaultDirection={defaultDirection}
                        direction={selectedDirection}
                        animation={animations[selectedAnimation]}
                        editCycle={editCycle}
                        pickFrame={pickFrame}
                        selectedFrame={selectedSheetId ? {
                            row: selectedRow,
                            col: selectedCol,
                            imageId: selectedSheetId,
                        } : undefined}
                    />
                )}
            </Stack>
        </Container>)

}