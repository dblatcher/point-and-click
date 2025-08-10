import { AddIcon, ClearIcon, UploadIcon } from "@/components/GameEditor/material-icons";
import { useGameDesign } from "@/context/game-design-context";
import { GameDataItem } from "@/definitions";
import { GameDataItemType } from "@/definitions/Game";
import { DATA_TYPES_WITH_JSON, tabIcons } from "@/lib/editor-config";
import { uploadJsonData } from "@/lib/files";
import { Alert, Box, Button, Grid, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { ZodSchema } from "zod";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { DataItemCard } from "./DataItemCard";
import { EditorHeading } from "./EditorHeading";
import { formatIdInput } from "./helpers";
import { StringInput } from "../SchemaForm/StringInput";

type Props<DataType extends GameDataItem> = {
    createBlank: { (): DataType }
    schema?: ZodSchema<DataType>
    designProperty: GameDataItemType
    itemTypeName: string
}


export const DataItemCreator = <DataType extends GameDataItem,>({ createBlank, schema, designProperty, itemTypeName }: Props<DataType>) => {
    const { gameDesign, createGameDataItem, openInEditor } = useGameDesign()
    const [warning, setWarning] = useState<string>()
    const [searchInput, setSearchInput] = useState('')
    const dataTypeArray = gameDesign[designProperty];

    const filteredItems = searchInput
        ? dataTypeArray.filter(i =>
            i.id.toLowerCase().includes(searchInput.toLowerCase())
        )
        : dataTypeArray

    const handleStartFromScratch = (proposedId: string) => {
        attemptCreate({ ...createBlank(), id: proposedId })
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

    const attemptCreate = (newDataItem: GameDataItem) => {
        setWarning(undefined)
        if (!newDataItem.id) {
            return setWarning('no id specified')
        }
        if (dataTypeArray.some(existingItem => existingItem.id == newDataItem.id)) {
            return setWarning(`${designProperty} already has a member with the id "${newDataItem.id}"`)
        }
        setSearchInput('');
        createGameDataItem(designProperty, newDataItem)
        openInEditor(designProperty, newDataItem.id)
    }

    const includeUploadButton = DATA_TYPES_WITH_JSON.includes(designProperty)

    const getInputIdError = (input: string) => {
        if (dataTypeArray.some(item => item.id === input)) {
            return `${itemTypeName} "${input}" aleady exists.`
        }
        return undefined
    }

    return (
        <Stack component={'article'} spacing={2} height={'100%'}>
            <EditorHeading heading={designProperty} icon={tabIcons[designProperty]} />
            <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                <StringInput notFullWidth label="search" value={searchInput} inputHandler={setSearchInput} />
                <IconButton color="primary" title="clear search" onClick={()=>setSearchInput('')} ><ClearIcon /></IconButton>
            </Box>
            <Grid container spacing={2} maxWidth={'95%'} paddingBottom={4}>
                {filteredItems.map(item => (
                    <Grid item key={item.id} xs={6} lg={4} xl={3}>
                        <DataItemCard key={item.id}
                            designProperty={designProperty}
                            item={item}
                            attemptCreate={attemptCreate}
                            itemTypeName={itemTypeName} />
                    </Grid>
                ))}
                <Grid item xs={6} lg={4} xl={3}>
                    <ButtonWithTextInput
                        label={`Add new ${itemTypeName}`}
                        onEntry={handleStartFromScratch}
                        modifyInput={formatIdInput}
                        buttonProps={{
                            startIcon: <AddIcon />,
                            variant: 'contained',
                            sx: { width: '100%', height: '100%', minHeight: 60 },
                        }}
                        getError={getInputIdError}
                        dialogTitle={`Enter ${itemTypeName} id`}
                        keyboardShortcut="#"
                    />
                </Grid>
                {includeUploadButton && (
                    <Grid item xs={6} lg={4} xl={3}>
                        <Button
                            sx={{ width: '100%', height: '100%', minHeight: 60 }}
                            variant="outlined"
                            onClick={handleLoadButton}
                            startIcon={<UploadIcon />}
                        >upload {itemTypeName} data</Button>
                    </Grid>
                )}
            </Grid>
            {warning && (
                <Box>
                    <Alert severity="warning">{warning}</Alert>
                </Box>
            )}
        </Stack >
    )

}