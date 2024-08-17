import { Direction, SpriteFrame } from "@/definitions";
import { Alert, Box, Button, Stack } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { FramePreview } from "./FramePreview";

interface Props {
    animKey: string;
    defaultDirection: Direction;
    direction: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    selectedFrame?: SpriteFrame;
    pickFrame: { (row: number, col: number, sheetId?: string): void };
}

export const AnimationFrameList = ({
    animKey, animation,
    editCycle, pickFrame,
    selectedFrame,
    direction
}: Props) => {
    const animationInDirection = animation[direction]

    const noFramesYet = !animationInDirection || animationInDirection.length === 0;

    return (
        <Stack>
            {!selectedFrame && <Alert severity='info'>Pick a frame to insert</Alert>}
            {noFramesYet && <Alert severity='info'>Add the first frame</Alert>}
            {animationInDirection &&
                <ArrayControl
                    list={animationInDirection}
                    insertText="insert frame"
                    mutateList={newlist => {
                        return editCycle(animKey, direction, newlist)
                    }}
                    describeItem={(frame) => (
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ display: 'flex', justifyContent: 'space-between', marginY: 1, paddingY: 0 }}
                            onClick={() => { pickFrame(frame.row, frame.col, frame.imageId) }}
                        >
                            <FramePreview
                                height={80}
                                width={80}
                                frame={frame} />
                            <p>{frame.imageId}</p>
                            <p>[{frame.col}, {frame.row}]</p>
                        </Button>
                    )}
                    createItem={selectedFrame ? () => ({ ...selectedFrame }) : undefined}
                />
            }
        </Stack>
    )
}