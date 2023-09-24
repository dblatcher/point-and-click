import { ConversationChoice } from "@/definitions";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import LogOut from '@mui/icons-material/Logout';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import EditIcon from '@mui/icons-material/Edit';

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
        <Stack
            spacing={1}
            flex={1}
            paddingBottom={1}
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            {openEditor && (
                <IconButton color="primary" onClick={openEditor} aria-label="edit">
                    <EditIcon />
                </IconButton>
            )}
            <Box sx={{ backgroundColor: 'secondary.dark', color: 'secondary.contrastText', borderRadius:4 }} paddingY={1} paddingX={3}>
                <Typography component={'q'}>
                    {choice.text ? truncateLine(choice.text, 40) : "[no text]"}
                </Typography>

            </Box>
            {choice.end && <Tooltip title='ends conversation'>< LogOut /></Tooltip>}
            {choice.disabled && <Tooltip title='starts disabled'>< SpeakerNotesOffIcon /></Tooltip>}
            {choice.once && <Tooltip title='can say only once'>< RepeatOneIcon /></Tooltip>}
        </Stack>
    )
}