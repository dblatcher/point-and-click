import { ConversationChoice } from "@/definitions";
import { Box, Button, Stack, Typography } from "@mui/material";

function truncateLine(text: string, length: number) {
    if (text.length <= length) {
        return text
    }
    return `${text.substring(0, length - 3)}...`;
}

interface Props {
    choice: ConversationChoice
    openEditor: { (): void }
}

export const ChoiceDescription = ({ choice, openEditor }: Props) => {

    return <Stack spacing={1} flex={1} direction={'row'} justifyContent={'flex-end'}>
        {choice.ref && (
            <Box>
                <Typography component={'span'} variant="caption">REF=</Typography>
                <Typography component={'b'}>{choice.ref}</Typography>
            </Box>
        )}
        <Box sx={{ backgroundColor: 'primary.light', color:'primary.contrastText' }} padding={1}>
            <Typography component={'q'}>
                {choice.text ? truncateLine(choice.text, 40) : "[no text]"}
            </Typography>
        </Box>
        <Button variant="outlined" onClick={openEditor}>edit</Button>
    </Stack>
}