import { GameDataItem } from "point-click-lib"
import { ButtonWithTextInput } from "../ButtonWithTextInput"
import { AddIcon } from "../material-icons"
import { formatIdInput } from "../helpers"


type Props = {
    itemTypeName: string,
    dataTypeArray: GameDataItem[],
    onEntry: { (input: string): void }
}

export const AddItemButton = ({
    itemTypeName,
    dataTypeArray,
    onEntry
}: Props) => {

    const getInputIdError = (input: string) => {
        if (dataTypeArray.some(item => item.id === input)) {
            return `${itemTypeName} "${input}" aleady exists.`
        }
        return undefined
    }

    return <ButtonWithTextInput
        label={`Add new ${itemTypeName}`}
        onEntry={onEntry}
        modifyInput={formatIdInput}
        buttonProps={{
            startIcon: <AddIcon />,
            sx: { flex: 1 },
        }}
        getError={getInputIdError}
        dialogTitle={`Enter ${itemTypeName} id`}
        keyboardShortcut="#"
    />
}