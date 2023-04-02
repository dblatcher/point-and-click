
import { useTheme } from "@mui/material";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { CommandLineProps } from "../game/uiComponentSet";


export function CommandLine({ verb, item, target, hoverTarget }: CommandLineProps) {
    const theme = useTheme()
    const Bold = (props: { text: string }) => <b style={{ color: theme.palette.primary.main }}>{props.text}{' '}</b>
    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id : '..?'

    return (
        <Container maxWidth={'sm'} sx={{ paddingY: .5 }}>
            <Card sx={{ padding: .5, height: '2.5em' }}>
                <Typography component={'div'} sx={{ lineHeight: 1 }}>
                    {verb && (
                        <span>{verb.label}{' '}</span>
                    )}
                    {(verb && item) && (
                        <Bold text={item.name || item.id} />
                    )}
                    {(verb?.preposition && item) && (
                        <span>{verb.preposition}{' '}</span>
                    )}
                    {(verb && target) && (
                        <span>{target.name || target.id}{' '}</span>
                    )}
                    {(!target) && (
                        <Bold text={hoverText} />
                    )}
                </Typography>
            </Card>
        </Container>
    )
}