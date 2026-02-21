import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { GameDataContext, UiStateContext } from "point-click-components";
import { memo, useContext } from 'react';
import { VerbMenuProps, verbMenuPropsAreEqual } from "../game/uiComponentSet";


export const VerbMenu = () => {
    const { gameDesign } = useContext(GameDataContext)
    const { uiState, dispatchUi } = useContext(UiStateContext)
    const { verbId } = uiState
    const { verbs } = gameDesign
    return <VerbMenuInner
        select={(verb) => {
            if (!verb.preposition) {
                dispatchUi({ type: 'SET_ITEM' })
            }
            dispatchUi({ type: 'SET_VERB', verbId: verb.id })
        }}
        verbs={verbs}
        currentVerbId={verbId}
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