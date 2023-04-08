import { memo } from 'react'
import { Box, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { CommandLineProps, commandLinePropsAreEqual } from "../game/uiComponentSet";


export const CommandLine = memo(function CommandLine({ verb, item, target, hoverTarget }: CommandLineProps) {
    const theme = useTheme()
    const Bold = (props: { text: string }) => <b style={{ color: theme.palette.secondary.main }}>{props.text}{' '}</b>
    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id : '..?'
    return (
        <Box sx={{ height: '2.5em', marginBottom:1 }}>
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
        </Box>
    )
}, commandLinePropsAreEqual)