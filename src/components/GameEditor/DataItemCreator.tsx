import { useGameDesign } from "@/context/game-design-context";
import { GameDataItem } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { AddIcon, ContentCopyIcon, EditIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { Alert, Button, Grid, Stack, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { ZodObject, ZodRawShape } from "zod";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { DeleteDataItemButton } from "./DeleteDataItemButton";
import { EditorHeading } from "./EditorHeading";
import { formatIdInput } from "./helpers";
import { DATA_TYPES_WITH_JSON } from "@/lib/editor-config";

type Props<DataType extends GameDataItem> = {
    createBlank: { (): DataType }
    schema?: ZodObject<ZodRawShape>
    designProperty: GameDataItemType
    itemTypeName: string
}


export const DataItemCreator = <DataType extends GameDataItem,>({ createBlank, schema, designProperty, itemTypeName }: Props<DataType>) => {
    const { gameDesign, performUpdate, openInEditor } = useGameDesign()
    const [warning, setWarning] = useState<string | undefined>()

    const handleStartFromScratch = (proposedId: string) => {
        attemptCreate({ ...createBlank(), id: proposedId })
    }

    function handleDuplicate(proposedId: string, item: GameDataItem): void {
        attemptCreate({ ...cloneData(item) as DataType, id: proposedId })
    }

    const handleLoadButton = async () => {
        if (!schema) {
            return setWarning(`no schema for uploading ${designProperty}`)
        }
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
            <EditorHeading heading={designProperty} />
            <Typography variant="h3">existing {itemTypeName}</Typography>
            <Grid container maxWidth={'sm'} spacing={2} alignItems={'center'}>
                {gameDesign[designProperty].map(item => (
                    <Fragment key={item.id}>
                        <Grid item xs={6}>
                            <Button
                                startIcon={<EditIcon />}
                                variant="contained"
                                sx={{ width: '100%' }}
                                onClick={() => openInEditor(designProperty, item.id)}
                            >{item.id}</Button>
                        </Grid>
                        <Grid item xs={2}>
                            <ButtonWithTextInput
                                label={'copy'}
                                buttonProps={{
                                    startIcon: <ContentCopyIcon />,
                                    variant: 'outlined',
                                    sx: { width: '100%' },
                                }}
                                modifyInput={formatIdInput}
                                onEntry={(newId) => handleDuplicate(newId, item)}
                                confirmationText={`Enter ${itemTypeName} id`}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <DeleteDataItemButton
                                buttonProps={{
                                    variant: 'outlined',
                                    sx: { width: '100%' },
                                }}
                                dataItem={item}
                                itemType={designProperty}
                                itemTypeName={itemTypeName}
                            />
                        </Grid>
                    </Fragment>
                ))}
            </Grid>

            <Typography variant="h3">Add new {itemTypeName}</Typography>

            <Grid container maxWidth={'sm'} spacing={2} alignItems={'center'}>
                <Grid item xs={6}>
                    <ButtonWithTextInput
                        label="Start from scratch"
                        onEntry={handleStartFromScratch}
                        modifyInput={formatIdInput}
                        buttonProps={{
                            startIcon: <AddIcon />,
                            variant: 'contained',
                            sx: { width: '100%' },
                        }}
                        confirmationText={`Enter ${itemTypeName} id`}
                        keyboardShortcut="#"
                    />
                </Grid>
                {includeLoadButton && (
                    <Grid item xs={4}>
                        <Button
                            sx={{ width: '100%' }}
                            variant="outlined"
                            onClick={handleLoadButton}
                            startIcon={<UploadIcon />}
                        >load from data file</Button>
                    </Grid>
                )}
            </Grid>

            {
                warning && (
                    <Alert severity="warning">{warning}</Alert>
                )
            }
        </Stack >
    )

}