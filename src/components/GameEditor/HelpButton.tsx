import { Box, Dialog, DialogContent, DialogTitle, IconButton, IconButtonProps } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { HelpText, SupportedHelpTopic } from "./HelpText";
import { HelpIcon } from "./material-icons";

interface Props {
    helpTopic: SupportedHelpTopic;
    buttonProps?: IconButtonProps
    fontSize?: "small" | "inherit" | "large" | "medium"
}


export const HelpButton: FunctionComponent<Props> = ({
    helpTopic, buttonProps, fontSize = 'medium'
}: Props) => {

    const [helpShowing, setHelpShowing] = useState(false)

    return (
        <>
            <IconButton
                aria-label={`open help text about ${helpTopic}`}
                onClick={(): void => { setHelpShowing(!helpShowing) }}
                {...buttonProps}
            >
                <HelpIcon fontSize={fontSize} />
            </IconButton>


            <Dialog open={helpShowing} onClose={() => { setHelpShowing(false) }}>
                <DialogTitle sx={{
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',
                    textTransform: 'capitalize',
                    alignItems: 'center',
                    display: 'flex',
                    gap: 5,
                }}>
                    <HelpIcon fontSize="large" />
                    {helpTopic}
                </DialogTitle>
                <DialogContent>
                    <Box paddingTop={2}>
                        {helpTopic && <HelpText topic={helpTopic} />}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )

}