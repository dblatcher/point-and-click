import { FunctionComponent, useState } from "react";
import { HelpText } from "./HelpText";
import editorStyles from "./editorStyles.module.css"
import { Typography, IconButton, Stack, Dialog, DialogTitle, DialogContent, Divider } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

interface Props {
    heading: string;
    helpTopic?: string;
    level?: 2 | 3;
}


export const EditorHeading: FunctionComponent<Props> = ({
    heading, helpTopic, level = 2
}: Props) => {

    const [helpShowing, setHelpShowing] = useState(false)

    return (
        <>
            <Stack component={'header'} direction={'row'} justifyContent={'space-between'}>
                <Typography variant={level === 2 ? 'h2' : 'h3'} sx={{ fontSize: '175%' }}>{heading}</Typography>
                {helpTopic && (
                    <IconButton
                        aria-label={`open help text about ${helpTopic}`}
                        className={[editorStyles.button, editorStyles.helpButton].join(" ")}
                        onClick={(): void => { setHelpShowing(!helpShowing) }}
                    >
                        <HelpIcon />
                    </IconButton>
                )}
            </Stack>
            <Divider sx={{marginY:1}}/>

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