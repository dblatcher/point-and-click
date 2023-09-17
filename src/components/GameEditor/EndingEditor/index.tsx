import { useState } from "react";
import { GameDesign, Ending } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { makeBlankEnding } from "../defaults";
import { StorageMenu } from "../StorageMenu";
import { listIds } from "@/lib/util";
import { FieldDef, SchemaForm, FieldValue, getModification } from "@/components/SchemaForm";
import { EndingSchema } from "@/definitions/Ending";
import imageService from "@/services/imageService";
import { EndingScreen } from "@/components/game-ui/EndingScreen";
import { DataItemEditorProps } from "../dataEditors";
import { EditorHeading } from "../EditorHeading";
import { Container, Typography } from "@mui/material";


type Props = DataItemEditorProps<Ending> & {
    gameDesign: GameDesign;
}


export const EndingEditor = (props: Props) => {

    const { gameDesign, updateData, deleteData,options, data: originalData } = props

    const initialState = (): Ending => {
        return originalData ? {
            ...cloneData(originalData)
        } : makeBlankEnding()
    }

    const [ending, setEnding] = useState(initialState())

    const handleUpdate = (value: FieldValue, field: FieldDef): void => {
        const property = field.key as keyof Ending;
        const mod = getModification(value, field)
        const newState = { ...ending, ...mod } as Ending
        setEnding(newState)

        if (options.autoSave && property !== 'id') {
            const isExistingId = listIds(gameDesign.endings).includes(ending.id)
            if (originalData && isExistingId) {
                updateData(newState)
            }
        }
    }


    return (
        <article>
            <EditorHeading heading="Ending Editor" itemId={originalData?.id} />

            <StorageMenu
                type="ending"
                update={() => updateData(ending)}
                deleteItem={deleteData}
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
                <Typography variant="h5" component='p'>Preview</Typography>
                <EndingScreen ending={ending} inline={true} />
            </Container>

        </article>
    )
}
