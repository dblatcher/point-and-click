import { FunctionComponent, useState } from "react";
import { HelpText } from "./HelpText";
import { Typography, IconButton, Stack, Dialog, DialogTitle, DialogContent, Divider, Box } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

interface Props {
    heading: string;
    itemId?: string;
    helpTopic?: string;
    level?: 2 | 3;
}


export const EditorHeading: FunctionComponent<Props> = ({
    heading, helpTopic, level = 2, itemId,
}: Props) => {

    const [helpShowing, setHelpShowing] = useState(false)

    return (
        <>
            <Stack component={'header'} direction={'row'} justifyContent={'space-between'}>
                <Box>
                    <Typography
                        variant={level === 2 ? 'h2' : 'h3'}
                        sx={{ fontSize: level === 2 ? '175%' : '150%' }}>
                        {heading}
                    </Typography>
                    {itemId && <Typography>{itemId}</Typography>}
                </Box>

                {helpTopic && (
                    <IconButton
                        aria-label={`open help text about ${helpTopic}`}
                        onClick={(): void => { setHelpShowing(!helpShowing) }}
                    >
                        <HelpIcon />
                    </IconButton>
                )}
            </Stack>
            <Divider sx={{ marginY: 1 }} />

            <Dialog open={!!(helpTopic && helpShowing)} onClose={() => { setHelpShowing(false) }}>
                <DialogTitle>
                    {helpTopic}
                </DialogTitle>
                <DialogContent>
                    {helpTopic && <HelpText topic={helpTopic} />}
                </DialogContent>
            </Dialog>
        </>
    )

}