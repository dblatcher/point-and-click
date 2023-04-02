
import { Verb } from "@/oldsrc"
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";


interface Props {
    verbs: Verb[];
    currentVerbId: string;
    select: { (verb: Verb): void };
}

export function VerbMenu({ verbs, currentVerbId, select }: Props) {

    return (
        <Container maxWidth={'sm'} sx={{ paddingY: .5 }}>

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


        </Container>
    )
}