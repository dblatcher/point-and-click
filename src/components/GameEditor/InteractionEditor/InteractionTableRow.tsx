import { Interaction } from "@/definitions";
import { IconButton, Stack, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { ArrowDownwardIcon, ArrowUpwardIcon, ClearIcon, EditIcon, FlagFilledIcon, FlagOutlinedIcon, InventoryIcon } from "../material-icons";
import { ConsequenceIconWithDescription } from "../SequenceEditor/get-order-details";

interface Props {
    index: number;
    interaction: Interaction;
    changeOrder?: { (index: number, direction: 'up' | 'down'): void }
    deleteInteraction?: { (index: number): void }
    openEditor: { (): void }
}

export const InteractionTableRow = ({ index, interaction, changeOrder, deleteInteraction, openEditor }: Props) => {
    const {
        verbId, targetId, targetStatus, itemId, roomId,
        consequences, flagsThatMustBeFalse = [], flagsThatMustBeTrue = [], requiredInventory = []
    } = interaction

    return (
        <TableRow key={index}>
            <TableCell>
                <Typography>{verbId}</Typography>
            </TableCell>
            <TableCell>
                <Typography component={'span'}>{targetId}</Typography>
                {targetStatus && <Typography variant="overline" component={'span'}>({targetStatus})</Typography>}
            </TableCell>
            <TableCell>
                <Typography>{itemId}</Typography>
            </TableCell>
            <TableCell>
                <Typography>{roomId}</Typography>
            </TableCell>
            <TableCell>
                {consequences.map((consequence, index) => <ConsequenceIconWithDescription key={index} consequence={consequence} />)}
            </TableCell>
            <TableCell>
                {flagsThatMustBeTrue.map((flagKey, index) => (
                    <Tooltip title={`${flagKey} must be ON`} key={index}>
                        <FlagFilledIcon />
                    </Tooltip>
                ))}
                {flagsThatMustBeFalse.map((flagKey, index) => (
                    <Tooltip title={`${flagKey} must be OFF`} key={index}>
                        <FlagOutlinedIcon />
                    </Tooltip>
                ))}
                {requiredInventory.map((itemId, index) => (
                    <Tooltip title={itemId} key={index}>
                        <InventoryIcon />
                    </Tooltip>
                ))}
            </TableCell>
            <TableCell padding="none">
                <Stack direction={'row'}>
                    <IconButton
                        onClick={openEditor}>
                        <EditIcon color="primary" />
                    </IconButton>

                    {changeOrder && (<>
                        <IconButton onClick={() => changeOrder(index, 'up')}>
                            <ArrowUpwardIcon />
                        </IconButton>

                        <IconButton onClick={() => changeOrder(index, 'down')}>
                            <ArrowDownwardIcon />
                        </IconButton>
                    </>)}

                    {deleteInteraction && (
                        <ButtonWithConfirm
                            useIconButton={true}
                            icon={<ClearIcon />}
                            label="delete this interaction"
                            onClick={() => { deleteInteraction(index) }}
                        />
                    )}
                </Stack>
            </TableCell>
        </TableRow >
    )

}