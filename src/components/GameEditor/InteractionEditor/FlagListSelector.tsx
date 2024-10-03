import { useGameDesign } from "@/context/game-design-context";
import { Box, Typography } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { SelectAndConfirm } from "../SelectAndConfirm";

interface Props {
    caption: string;
    flagList: string[],
    setFlagList: { (newList: string[]): void }
}

export const FlagListSelector = ({ caption, flagList, setFlagList }: Props) => {
    const { gameDesign } = useGameDesign()

    return (
        <Box paddingBottom={2}>
            <Typography variant="caption">
                {caption}[{flagList?.length || 0}]
            </Typography>
            <Box paddingLeft={4}>
                <ArrayControl noMoveButtons buttonSize="small"
                    list={flagList || []}
                    describeItem={(item, index) => (
                        <Typography key={index}>{item}</Typography>
                    )}
                    mutateList={newList => setFlagList(newList)}
                />
                <SelectAndConfirm
                    boxProps={{ minWidth: 200, display: 'flex', alignItems: 'flex-end' }}
                    options={Object.keys(gameDesign.flagMap).filter(id => !flagList?.includes(id))}
                    inputHandler={flagId => {
                        if (flagId.length === 0) { return }
                        const newList = [...flagList || [], flagId]
                        setFlagList(newList)
                    }}
                />
            </Box>
        </Box>
    )
}