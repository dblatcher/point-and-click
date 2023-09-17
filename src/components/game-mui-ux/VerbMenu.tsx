import { memo } from 'react';
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";
import { Verb } from '@/definitions';
import { useGameState } from '../game/game-state-context';
import { useGameInfo } from '@/context/game-info-provider';


export const VerbMenu = (props: { select: { (verb: Verb): void }; }) => {
    const { currentVerbId } = useGameState()
    const { verbs } = useGameInfo()
    return <VerbMenuInner select={props.select} verbs={verbs} currentVerbId={currentVerbId} />
}

export const VerbMenuInner = memo(function VerbMenu({ verbs, currentVerbId, select }: VerbMenuProps) {
    return (
        <Grid container mb={1}>
            {verbs.map(verb => (
                <Grid item key={verb.id} flex={1} xs={3} sx={{ display: 'flex' }} >
                    <Button
                        sx={{
                            flex: 1,
                            lineHeight: 1,
                            minHeight: '2rem',
                            borderRadius: 0,
                        }}
                        size="small"
                        color={'secondary'}
                        variant={currentVerbId === verb.id ? 'contained' : 'outlined'}
                        onClick={() => { select(verb) }}
                    >
                        {verb.label}
                    </Button>
                </Grid>
            ))}
        </Grid>
    )
}, verbMenuPropsAreEqual)