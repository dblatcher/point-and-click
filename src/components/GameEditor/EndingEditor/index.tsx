import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { EndingScreen } from "@/components/game-ui/EndingScreen";
import { useGameDesign } from "@/context/game-design-context";
import { Ending } from "@/definitions";
import { EndingSchema } from "@/definitions/Ending";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import imageService from "@/services/imageService";
import { Container, Typography } from "@mui/material";
import { useState } from "react";
import { EditorHeading } from "../EditorHeading";
import { StorageMenu } from "../StorageMenu";
import { makeBlankEnding } from "../defaults";


type Props = {
    data?: Ending;
}


export const EndingEditor = (props: Props) => {
    const { gameDesign, deleteArrayItem, performUpdate, options } = useGameDesign()
    const { data: originalData } = props

    const initialState = (): Ending => {
        return originalData ? {
            ...cloneData(originalData)
        } : makeBlankEnding()
    }

    const [ending, setEnding] = useState(initialState())

    const handleUpdate = (value: FieldValue, field: FieldDef): void => {
        const newState = { ...ending, ...getModification(value, field) } as Ending
        setEnding(newState)

        if (options.autoSave && field.key !== 'id') {
            const isExistingId = listIds(gameDesign.endings).includes(ending.id)
            if (originalData && isExistingId) {
                performUpdate('endings', newState)
            }
        }
    }


    return (
        <article>
            <EditorHeading heading="Ending Editor" itemId={originalData?.id} />

            <StorageMenu
                type="ending"
                update={() => performUpdate('endings', ending)}
                deleteItem={(index) => deleteArrayItem(index, 'endings')}
                existingIds={listIds(gameDesign.endings)}
                data={ending}
                originalId={originalData?.id}
                reset={() => setEnding(initialState())}
                options={options}
            />

            <SchemaForm
                formLegend="Ending Config"
                data={ending}
                schema={EndingSchema}
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
                    maxWidth: 'sm',
                    sx: {
                        backgroundColor: 'grey.100',
                    }
                }}
            />

            <Container>
                <Typography variant="h3">Preview</Typography>
                <EndingScreen ending={ending} inline={true} />
            </Container>

        </article>
    )
}
