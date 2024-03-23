import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { EndingScreen } from "@/components/game-ui/EndingScreen";
import { useGameDesign } from "@/context/game-design-context";
import { Ending } from "@/definitions";
import { EndingSchema } from "@/definitions/Ending";
import { cloneData } from "@/lib/clone";
import imageService from "@/services/imageService";
import { Card, Container, Grid, Typography } from "@mui/material";
import { DeleteDataItemButton } from "../DeleteDataItemButton";
import { EditorHeading } from "../EditorHeading";


type Props = {
    ending: Ending;
}


export const EndingEditor = ({ ending }: Props) => {
    const { performUpdate } = useGameDesign()

    const handleUpdate = (value: FieldValue, field: FieldDef): void => {
        if (field.key === 'id') {
            console.warn('EndingEditor tried to change id', { value })
            return
        }
        const newState = { ...cloneData(ending), ...getModification(value, field) } as Ending
        performUpdate('endings', newState)
    }

    return (
        <article>
            <EditorHeading heading="Ending Editor" itemId={ending.id} >
                <DeleteDataItemButton
                    dataItem={ending}
                    buttonProps={{ variant: 'outlined' }}
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
                        imageId: imageService.list()
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
