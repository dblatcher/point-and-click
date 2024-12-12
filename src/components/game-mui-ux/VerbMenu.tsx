import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { memo } from 'react';
import { useGameState } from '../../context/game-state-context';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";


export const VerbMenu = () => {
    const { gameState, dispatchGameStateAction, gameProps } = useGameState()
    const { currentVerbId } = gameState
    const { verbs } = gameProps
    return <VerbMenuInner
        select={(verb) => { dispatchGameStateAction({ type: 'VERB-SELECT', verb }) }}
        verbs={verbs}
        currentVerbId={currentVerbId}
    />
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