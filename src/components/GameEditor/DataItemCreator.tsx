import { useGameDesign } from "@/context/game-design-context";
import { GameDataItem } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from "@mui/icons-material/Upload";
import { Alert, Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ZodObject, ZodRawShape } from "zod";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { EditorHeading } from "./EditorHeading";
import { GameDataItemType } from "@/definitions/Game";

type Props<DataType extends GameDataItem> = {
    openInEditor: { (designProperty: GameDataItemType, id: string): void }
    createBlank: { (): DataType }
    schema: ZodObject<ZodRawShape>
    designProperty: GameDataItemType
    itemTypeName: string
}

const DATA_TYPES_WITH_JSON: GameDataItemType[] = [
    'rooms', 'actors', 'conversations', 'sprites',
]

export const DataItemCreator = <DataType extends GameDataItem,>({ openInEditor, createBlank, schema, designProperty, itemTypeName }: Props<DataType>) => {
    const { gameDesign, performUpdate } = useGameDesign()
    const [warning, setWarning] = useState<string | undefined>()

    const handleStartFromScratch = (proposedId: string) => {
        attemptCreate({ ...createBlank(), id: proposedId })
    }

    function handleDuplicate(proposedId: string, item: GameDataItem): void {
        attemptCreate({ ...cloneData(item) as DataType, id: proposedId })
    }

    const handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(schema)
        if (error) {
            return setWarning(`upload failed: ${error}`)
        }
        if (!data) {
            return setWarning(`File did not contain valid data for ${designProperty}`)
        }
        attemptCreate(data as unknown as DataType)
    }

    const attemptCreate = (newDataItem: DataType) => {
        setWarning(undefined)
        if (!newDataItem.id) {
            return setWarning('no id specified')
        }
        const existingData = gameDesign[designProperty]
        if (existingData.some(existingItem => existingItem.id == newDataItem.id)) {
            return setWarning(`${designProperty} already has a member with the id "${newDataItem.id}"`)
        }
        performUpdate(designProperty, newDataItem)
        openInEditor(designProperty, newDataItem.id)
    }

    const includeLoadButton = DATA_TYPES_WITH_JSON.includes(designProperty)

    return (
        <Stack component={'article'} spacing={2} height={'100%'}>
            <EditorHeading heading={`${itemTypeName} Creator`} />

            <Typography variant="h3">Add new {itemTypeName}</Typography>
            <ButtonGroup>
                <ButtonWithTextInput
                    label="Start from scratch"
                    onEntry={handleStartFromScratch}
                    buttonProps={{ startIcon: <AddIcon /> }}
                    confirmationText={`Enter ${itemTypeName} id`}
                />
                {includeLoadButton && (
                    <Button
                        onClick={handleLoadButton}
                        startIcon={<UploadIcon />}
                    >load from data file</Button>
                )}
            </ButtonGroup>

            <Typography variant="h3">Duplicate existing {itemTypeName}</Typography>
            <Box>
                <ButtonGroup orientation="vertical">
                    {gameDesign[designProperty].map(item => (
                        <ButtonWithTextInput key={item.id}
                            label={item.id}
                            buttonProps={{ startIcon: <ContentCopyIcon /> }}
                            onEntry={(newId) => handleDuplicate(newId, item)}
                            confirmationText={`Enter ${itemTypeName} id`}
                        />
                    ))}
                </ButtonGroup>
            </Box>

            {warning && (
                <Alert severity="warning">{warning}</Alert>
            )}
        </Stack>
    )

}