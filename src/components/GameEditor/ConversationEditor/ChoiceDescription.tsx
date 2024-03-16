import { ConversationChoice } from "@/definitions";
import LogOut from '@mui/icons-material/Logout';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import { Button, Tooltip, Typography } from "@mui/material";

function truncateLine(text: string, length: number) {
    if (text.length <= length) {
        return text
    }
    return `${text.substring(0, length - 3)}...`;
}

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