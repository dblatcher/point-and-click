import { AddIcon, ContentCopyIcon, EditIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { ActorData, GameDataItem, ItemData, RoomData } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { cloneData } from "@/lib/clone";
import { DATA_TYPES_WITH_JSON } from "@/lib/editor-config";
import { uploadJsonData } from "@/lib/files";
import { Alert, Box, Button, ButtonGroup, Divider, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { ZodSchema } from "zod";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { DeleteDataItemButton } from "./DeleteDataItemButton";
import { EditorHeading } from "./EditorHeading";
import { formatIdInput } from "./helpers";
import { InteractionsDialogsButton } from "./InteractionsDialogsButton";
import { RoomLocationPicker } from "./RoomLocationPicker";
import { FramePreview } from "./SpriteEditor/FramePreview";
import { SpritePreview } from "./SpritePreview";

type Props<DataType extends GameDataItem> = {
    createBlank: { (): DataType }
    schema?: ZodSchema<DataType>
    designProperty: GameDataItemType
    itemTypeName: string
}

const ItemPreview = ({ item, designProperty }: { item: GameDataItem, designProperty: GameDataItemType }) => {
    if (designProperty === 'rooms') {
        const roomData = item as RoomData
        return <RoomLocationPicker roomData={roomData} previewHeight={60} viewAngle={0} />
    }
    if (designProperty === 'actors') {
        const actorData = item as ActorData
        return <SpritePreview data={actorData} animation='default' noBaseLine maxHeight={60} />
    }
    if (designProperty === 'items') {
        const { imageId, row = 0, col = 0 } = item as ItemData
        if (imageId) {
            return <FramePreview frame={{ imageId, row, col }} height={50} width={50} />
        }
        return <Box sx={{ height: 50 }}></Box>
    }
    return null
}

const ItemInteraction = ({ item, designProperty }: { item: GameDataItem, designProperty: GameDataItemType }) => {
    const { id } = item
    if (designProperty === 'actors') {
        const { noInteraction } = item as ActorData
        return <InteractionsDialogsButton disabled={noInteraction} criteria={i => i.targetId === id} newPartial={{ targetId: id }} />
    }
    if (designProperty === 'items') {
        return <InteractionsDialogsButton criteria={i => i.targetId === id || i.itemId === id} newPartial={{ itemId: id }} />
    }
    return null
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

    const getInputIdError = (input: string) => {
        if (gameDesign[designProperty].some(item => item.id === input)) {
            return `${itemTypeName} "${input}" aleady exists.`
        }
        return undefined
    }

    return (
        <Stack component={'article'} spacing={2} height={'100%'}>
            <EditorHeading heading={designProperty} />
            <Stack component={'article'} spacing={2} divider={<Divider />}>
                {gameDesign[designProperty].map(item => (
                    <Grid container maxWidth={'sm'} spacing={2} alignItems={'center'} key={item.id}>
                        <Grid item xs={3}>
                            <Button
                                startIcon={<EditIcon />}
                                variant="contained"
                                sx={{ width: '100%' }}
                                onClick={() => openInEditor(designProperty, item.id)}
                            >{item.id}</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <ButtonGroup>
                                <ItemInteraction item={item} designProperty={designProperty} />
                                <ButtonWithTextInput
                                    label={'copy'}
                                    buttonProps={{
                                        startIcon: <ContentCopyIcon />,
                                        variant: 'outlined',
                                    }}
                                    getError={getInputIdError}
                                    modifyInput={formatIdInput}
                                    onEntry={(newId) => handleDuplicate(newId, item)}
                                    dialogTitle={`Enter ${itemTypeName} id`}
                                />
                                <DeleteDataItemButton
                                    buttonProps={{
                                        variant: 'outlined',
                                    }}
                                    dataItem={item}
                                    itemType={designProperty}
                                    itemTypeName={itemTypeName}
                                />
                            </ButtonGroup>
                        </Grid>

                        <Grid item xs={3} display={'flex'} justifyContent={'flex-end'}>
                            <ItemPreview item={item} designProperty={designProperty} />
                        </Grid>
                    </Grid>
                ))}
                <Grid container maxWidth={'sm'} spacing={2} alignItems={'center'}>
                    <Grid item xs={6}>
                        <ButtonWithTextInput
                            label={`Add new ${itemTypeName}`}
                            onEntry={handleStartFromScratch}
                            modifyInput={formatIdInput}
                            buttonProps={{
                                startIcon: <AddIcon />,
                                variant: 'contained',
                                sx: { width: '100%' },
                            }}
                            getError={getInputIdError}
                            dialogTitle={`Enter ${itemTypeName} id`}
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
                            >upload {itemTypeName} data</Button>
                        </Grid>
                    )}
                </Grid>
            </Stack>

            {warning && (
                <Alert severity="warning">{warning}</Alert>
            )}
        </Stack >
    )

}