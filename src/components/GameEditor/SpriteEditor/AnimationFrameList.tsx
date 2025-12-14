import { Direction, SpriteFrame } from "@/definitions";
import { insertAt, replaceAt } from "@/lib/util";
import { Box } from "@mui/material";
import { useState } from "react";
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
}

export const AnimationFrameList = ({
    animKey,
    animation,
    editCycle,
    direction
}: Props) => {
    const [selectedSheetId, setSelectedSheetId] = useState<string>();
    const animationInDirection = animation[direction] ?? []

    return (
        <ArrayControl
            list={animationInDirection}
            insertText="insert frame"
            mutateList={newList => {
                return editCycle(animKey, direction, newList)
            }}
            describeItem={(frame, index) => (
                <FramePickDialogButton
                    buttonLabel="Change frame"
                    buttonProps={{ sx: { width: '100%' } }}
                    buttonContent={
                        <Box flex={1} display={'flex'}>
                            <FramePreview
                                height={60}
                                width={60}
                                frame={frame} />
                            <div>
                                <p>{frame.imageId}</p>
                                <p>[{frame.col}, {frame.row}]</p>
                            </div>
                        </Box>
                    }
                    quickPicking
                    noOptions
                    defaultState={frame}
                    pickFrame={(row, col, imageId) => {
                        const newFrame = imageId ? { row, col, imageId } : undefined;
                        if (!newFrame) {
                            return
                        }
                        setSelectedSheetId(newFrame.imageId)
                        const newList = replaceAt(index, newFrame, animationInDirection);
                        return editCycle(animKey, direction, newList)
                    }}
                />
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
                    defaultState={{ imageId: selectedSheetId, row: 0, col: 0 }}
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