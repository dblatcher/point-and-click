import { useGameDesign } from "@/context/game-design-context";
import { GameDataItem } from "@/definitions";
import { DeleteIcon } from "@/components/GameEditor/material-icons";
import { ButtonWithConfirm } from "./ButtonWithConfirm";
import { GameDataItemType } from "@/definitions/Game";
import { ButtonProps } from "@mui/material";

type Props = {
    dataItem: GameDataItem;
    itemType: GameDataItemType;
    itemTypeName: string;
    buttonProps?: ButtonProps
}

export const DeleteDataItemButton = ({ dataItem, itemType, itemTypeName, buttonProps }: Props) => {
    const { gameDesign, deleteArrayItem } = useGameDesign()

    return (
        <ButtonWithConfirm
            confirmationText={`Are you sure you want to delete ${itemTypeName} "${dataItem.id}"?`}
            label="delete"
            buttonProps={{ 
                startIcon: <DeleteIcon />, 
                color: 'warning', 
                ...buttonProps 
            }}
            onClick={() => {
                const items = gameDesign[itemType]
                const index = items.findIndex(otherItem => otherItem.id === dataItem.id)
                if (index === -1) {
                    return console.error(`${itemTypeName} not found when trying to delete`, { dataItem, items })
                }
                deleteArrayItem(index, itemType)
            }}
        />

    )
}
