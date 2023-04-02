
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { VerbMenuProps } from "../game/uiComponentSet";
import { UiContainer } from "./UiContainer";


export function VerbMenu({ verbs, currentVerbId, select }: VerbMenuProps) {

    return (
        <UiContainer>
            <Grid container component={Card}>
                {verbs.map(verb => (
                    <Grid item key={verb.id} flex={1} xs={3}  sx={{ display: 'flex' }} >
                        <Button
                            sx={{
                                flex: 1,
                                lineHeight:1,
                                minHeight:'2rem',
                                borderRadius:0,
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
        </UiContainer>
    )
}