import { useGameDesign } from "@/context/game-design-context";
import { Box, Button, Stack } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { DeleteDataItemButton } from "../game-item-components/DeleteDataItemButton";
import { AddIcon, EditIcon } from "../material-icons";
import { ButtonWithTextInput } from "../ButtonWithTextInput";
import { makeBlankVerb } from "../defaults";
import { formatIdInput } from "../helpers";


export const VerbListControl = () => {
    const { applyModification } = useGameDesign()
    const { gameItemIds: { verbs: currentVerbId }, gameDesign: { verbs }, createGameDataItem, openInEditor } = useGameDesign()

    const getInputIdError = (input: string) => {
        if (verbs.some(item => item.id === input)) {
            return `verb "${input}" aleady exists.`
        }
        return undefined
    }
    function addNewVerb(newId: string): void {
        createGameDataItem('verbs', makeBlankVerb(newId))
        openInEditor('verbs', newId)

    }

    return (
        <Stack spacing={4}>
            <ArrayControl noDeleteButtons horizontalMoveButtons
                list={verbs}
                getIdent={verb => verb.id}
                mutateList={(verbs) => applyModification('change verb order', { verbs })}
                stackProps={{ flex: 1 }}
                describeItem={(verb) => (
                    <Box display={'flex'}>
                        <Button variant={verb.id === currentVerbId ? 'contained' : 'text'}
                            startIcon={<EditIcon />}
                            onClick={() => openInEditor('verbs', verb.id)}
                            sx={{ flex: 1 }}
                        >
                            {verb.id}
                        </Button>
                        <DeleteDataItemButton
                            useIconButton
                            dataItem={verb}
                            itemType={'verbs'}
                            itemTypeName={'verb'}
                        />
                    </Box>
                )}
            />

            <ButtonWithTextInput
                label={`Add new verb`}
                onEntry={addNewVerb}
                modifyInput={formatIdInput}
                buttonProps={{
                    variant: 'contained',
                    fullWidth: true,
                    startIcon: <AddIcon />,
                    sx: { flex: 1 },
                }}
                getError={getInputIdError}
                dialogTitle={`Enter verb id`}
                keyboardShortcut="#"
            />
        </Stack>
    )
}