import { VerbMenuInner } from "@/components/game-ui/VerbMenu";
import { useGameDesign } from "@/context/game-design-context";
import { listIds } from "@/lib/util";
import { Paper, Stack, Typography } from "@mui/material";
import { ArrayControl } from "./ArrayControl";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";


export const VerbMenuEditor = () => {
    const { gameDesign, performUpdate } = useGameDesign()
    const updateData = (data: unknown) => { performUpdate('verbs', data) }
    return (<>
        <EditorHeading heading="Verb Menu" helpTopic="verb menu" />
        <Stack direction="row" justifyContent="space-between">
            <ArrayControl noDeleteButtons horizontalMoveButtons
                list={gameDesign.verbs}
                mutateList={(list) => { updateData(list) }}
                describeItem={(verb, index) => (
                    <Typography key={index}>{verb.id} : {verb.label}</Typography>
                )}
            />
            <EditorBox title="Preview">
                <Paper>
                    <VerbMenuInner key={listIds(gameDesign.verbs).join()}
                        verbs={gameDesign.verbs}
                        currentVerbId={gameDesign.verbs[0] ? gameDesign.verbs[0].id : ''}
                        select={() => { }}
                    />
                </Paper>
            </EditorBox>
        </Stack>
    </>)
}