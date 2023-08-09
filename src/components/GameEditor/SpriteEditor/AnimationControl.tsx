
import { Direction, SpriteFrame } from "@/definitions";
import { Box, Button, Stack } from "@mui/material";
import { ListEditor } from "../ListEditor";
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

export const AnimationControl = ({
    animKey, animation,
    editCycle, pickFrame,
    selectedFrame,
    direction
}: Props) => {
    const addDirection = (direction: Direction) => {
        return editCycle(animKey, direction, [])
    }
    const animationInDirection = animation[direction]

    return (<>
        {animationInDirection ?
            (<Stack>
                <ListEditor tight
                    list={animation[direction] as SpriteFrame[]}
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
                                backgroundColor={'yellow'}
                                frame={frame} />
                            <p>{frame.imageId}</p>
                            <p>[{frame.col}, {frame.row}]</p>
                        </Button>
                    )}
                    createItem={() => selectedFrame ? { ...selectedFrame } : undefined}
                />
            </Stack>
            ) : (
                <Box>
                    <Button
                        variant="contained"
                        onClick={() => { addDirection(direction) }}
                    >Add Frame for: {direction}
                    </Button>
                </Box>
            )
        }
    </>)
}