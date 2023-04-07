import { memo } from 'react'
import { useTheme } from "@mui/material";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import { CommandLineProps, commandLinePropsAreEqual } from "../game/uiComponentSet";


export const CommandLine = memo(function CommandLine({ verb, item, target, hoverTarget }: CommandLineProps) {
    const theme = useTheme()
    const Bold = (props: { text: string }) => <b style={{ color: theme.palette.primary.main }}>{props.text}{' '}</b>
    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id : '..?'
    return (
        <Card sx={{ padding: .5, height: '2.5em', marginY:1 }}>
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
    )
}, commandLinePropsAreEqual)