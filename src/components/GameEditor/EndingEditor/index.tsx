import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { EndingScreen } from "@/components/game-ui/EndingScreen";
import { useGameDesign } from "@/context/game-design-context";
import { Ending } from "@/definitions";
import { EndingSchema } from "@/definitions/Ending";
import { Card, Container, Typography } from "@mui/material";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { patchMember } from "@/lib/update-design";
import { useAssets } from "@/context/asset-context";

type Props = {
    ending: Ending;
}

export const EndingEditor = ({ ending }: Props) => {
    const { applyModification, gameDesign } = useGameDesign()
    const { listIds } = useAssets()

    const handleUpdate = (value: FieldValue, field: FieldDef): void => {
        if (field.key === 'id') {
            console.warn('EndingEditor tried to change id', { value })
            return
        }
        const mod = getModification(value, field) as Partial<Ending>
        applyModification(
            `change ${field.key} on verb ${ending.id}`,
            { endings: patchMember(ending.id, mod, gameDesign.endings) }
        )
    }

    return (
        <article>
            <EditorHeading heading="Ending Editor" itemId={ending.id} >
                <ItemEditorHeaderControls
                    dataItem={ending}
                    itemType='endings'
                    itemTypeName="ending" />
            </EditorHeading>

            <Typography variant="h3">Ending Config</Typography>
            <Card sx={{ maxWidth: 'sm' }}>
                <SchemaForm
                    data={ending}
                    schema={EndingSchema.omit({ id: true })}
                    changeValue={(value, field) => { handleUpdate(value, field) }}
                    options={{
                        imageId: listIds()
                    }}
                    fieldWrapperProps={{
                        spacing: 2,
                    }}
                    containerProps={{
                        padding: 1,
                        marginY: 1,
                    }}
                />
            </Card>
            <Container>
                <Typography variant="h3">Preview</Typography>
                <EndingScreen ending={ending} inline={true} />
            </Container>
        </article>
    )
}
