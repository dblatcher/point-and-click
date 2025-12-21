import { ConversationChoice } from "point-click-lib";
import { Button, Tooltip, Typography } from "@mui/material";
import { LogOut, SpeakerNotesOffIcon, RepeatOneIcon } from "@/components/GameEditor/material-icons"
import { truncateLine } from "../helpers";

interface Props {
    choice: ConversationChoice
    openEditor?: { (): void }
}

export const ChoiceDescription = ({ choice, openEditor }: Props) => {

    return (
        <Button
            color="secondary" sx={{
                textTransform: 'none',
                marginBottom: 1,
                justifyContent: 'flex-start',
                display: 'flex',
                width: '100%',
                paddingX: 2,
                paddingY: 1,

            }} variant="outlined"
            onClick={openEditor}
        >
            <Typography component={'q'} marginRight={'auto'}>
                {choice.text ? truncateLine(choice.text, 40) : "[no text]"}
            </Typography>
            {choice.end && <Tooltip title='ends conversation'>< LogOut /></Tooltip>}
            {choice.disabled && <Tooltip title='starts disabled'>< SpeakerNotesOffIcon /></Tooltip>}
            {choice.once && <Tooltip title='can say only once'>< RepeatOneIcon /></Tooltip>}
        </Button>
    )
}