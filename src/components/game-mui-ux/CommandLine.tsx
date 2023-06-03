import { CommandTarget, ItemData, Verb } from '@/definitions';
import { findById } from '@/lib/util';
import { Box, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { memo } from 'react';
import { useGameState } from '../game/game-state-context';
import { useGameInfo } from '../game/game-info-provider';

type InnerCommandLineProps = {
    verb?: Verb;
    item?: ItemData;
    hoverTarget?: CommandTarget;
}
export const innerCommandLinePropsAreEqual = (prevProps: InnerCommandLineProps, nextProps: InnerCommandLineProps): boolean => {
    return prevProps.verb === nextProps.verb &&
        prevProps.item === nextProps.item &&
        prevProps.hoverTarget === nextProps.hoverTarget
}

const CommandLineInner = memo(function CommandLine({ verb, item, hoverTarget }: InnerCommandLineProps) {
    const theme = useTheme()
    const Bold = (props: { text: string }) => <b style={{ color: theme.palette.secondary.main }}>{props.text}{' '}</b>
    const hoverText = hoverTarget ? hoverTarget.name || hoverTarget.id : '..?'
    return (
        <Box sx={{ height: '2.5em', marginBottom: 1 }}>
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
                {(hoverText) && (
                    <Bold text={hoverText} />
                )}
            </Typography>
        </Box>
    )
}, innerCommandLinePropsAreEqual)

export const CommandLine = () => {
    const state = useGameState()
    const { verb } = useGameInfo()
    const { items, currentItemId, hoverTarget } = state

    return (
        <CommandLineInner
            verb={verb}
            hoverTarget={hoverTarget}
            item={findById(currentItemId, items)}
        />
    )
}