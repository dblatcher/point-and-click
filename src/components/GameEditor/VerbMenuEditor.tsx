import { VerbMenuInner } from "@/components/game-ui/VerbMenu";
import { useGameDesign } from "@/context/game-design-context";
import { listIds } from "@/lib/util";
import { Paper, Stack, Typography } from "@mui/material";
import { ArrayControl } from "./ArrayControl";
import { EditorBox } from "./EditorBox";
import { EditorHeading } from "./EditorHeading";
import { tabIcons } from "@/lib/editor-config";


export const VerbMenuEditor = () => {
    const { gameDesign, applyModification } = useGameDesign()
    return (<>
        <EditorHeading heading="Verb Menu" helpTopic="verb menu"  icon={tabIcons['verbs']}/>
        <Stack direction="row" justifyContent="space-between">
            <ArrayControl noDeleteButtons horizontalMoveButtons
                list={gameDesign.verbs}
                mutateList={(verbs) => applyModification('change verb order', { verbs })}
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