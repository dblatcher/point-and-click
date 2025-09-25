import { useGameDesign } from "@/context/game-design-context";
import { tabIcons } from "@/lib/editor-config";
import { Stack, Typography } from "@mui/material";
import { ArrayControl } from "./ArrayControl";
import { EditorHeading } from "./layout/EditorHeading";


export const VerbMenuEditor = () => {
    const { gameDesign, applyModification } = useGameDesign()
    return (<>
        <EditorHeading heading="Verb Order" helpTopic="verb menu"  icon={tabIcons['verbs']}/>
        <Stack direction="row" justifyContent="space-between">
            <ArrayControl noDeleteButtons horizontalMoveButtons
                list={gameDesign.verbs}
                mutateList={(verbs) => applyModification('change verb order', { verbs })}
                describeItem={(verb, index) => (
                    <Typography key={index}>{verb.id} : {verb.label}</Typography>
                )}
            />
        </Stack>
    </>)
}