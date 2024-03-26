import HelpIcon from "@mui/icons-material/Help";
import { Dialog, DialogContent, DialogTitle, IconButton, IconButtonProps, SvgIconPropsSizeOverrides } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { HelpText } from "./HelpText";

interface Props {
    helpTopic: string;
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