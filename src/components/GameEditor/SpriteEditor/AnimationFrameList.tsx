import { Direction, SpriteFrame } from "@/definitions";
import { insertAt } from "@/lib/util";
import { Button } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ArrayControl } from "../ArrayControl";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { FramePreview } from "../FramePreview";
import { AddIcon } from "../material-icons";

interface Props {
    animKey: string;
    defaultDirection: Direction;
    direction: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    editCycle: { (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined): void };
    imageId?: string;
    setSelectedSheetId: Dispatch<SetStateAction<string | undefined>>
}

export const AnimationFrameList = ({
    animKey,
    animation,
    editCycle,
    setSelectedSheetId,
    imageId,
    direction
}: Props) => {
    const animationInDirection = animation[direction] ?? []

    return (
        <ArrayControl
            list={animationInDirection}
            insertText="insert frame"
            mutateList={newList => {
                return editCycle(animKey, direction, newList)
            }}
            describeItem={(frame) => (
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ display: 'flex', justifyContent: 'space-between', marginY: 1, paddingY: 0 }}
                    onClick={() => { setSelectedSheetId(frame.imageId) }}
                >
                    <FramePreview
                        height={60}
                        width={60}
                        frame={frame} />
                    <div>
                        <p>{frame.imageId}</p>
                        <p>[{frame.col}, {frame.row}]</p>
                    </div>
                </Button>
            )}
            customCreateButton={(index) =>
                <FramePickDialogButton
                    buttonProps={{
                        startIcon: <AddIcon />,
                        sx: { alignSelf: 'center' }
                    }}
                    buttonLabel="Insert frame"
                    quickPicking
                    noOptions
                    defaultState={{ imageId, row: 0, col: 0 }}
                    pickFrame={(row, col, imageId) => {
                        const newFrame = imageId ? { row, col, imageId } : undefined;
                        if (!newFrame) {
                            return
                        }
                        setSelectedSheetId(newFrame.imageId)
                        const newList = insertAt(index, newFrame, animationInDirection);
                        return editCycle(animKey, direction, newList)
                    }}
                />
            }
            stackProps={{
                minWidth: 250,
                minHeight: 180
            }}
        />
    )
}