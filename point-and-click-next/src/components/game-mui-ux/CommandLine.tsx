
import { ItemData, CommandTarget, Verb } from "@/oldsrc";
import { useTheme } from "@mui/material";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";

interface Props {
    verb?: Verb;
    item?: ItemData;
    target?: CommandTarget;
    hoverTarget?: CommandTarget;
}

export function CommandLine({ verb, item, target, hoverTarget }: Props) {

    let text = '>'

    if (verb) {
        text = `${verb.label}`;

        if (item) {
            text += ` ${item.name || item.id} ${verb.preposition}`
        }

        if (target) {
            text += ` ${target.name || target.id}`
        }
    }

    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id : '...';

    const theme = useTheme()

    return (
        <Container maxWidth={'sm'} sx={{ padding: 1 }}>
            <Card sx={{ padding: .5, height:'2.5em' }}>
                <Typography component={'span'}>
                    {text}
                </Typography>
                {!target && (
                    <Typography component={'span'} color={theme.palette.primary.main}>
                        {' '}{hoverText}
                    </Typography>
                )}
            </Card>
        </Container>
    )
}