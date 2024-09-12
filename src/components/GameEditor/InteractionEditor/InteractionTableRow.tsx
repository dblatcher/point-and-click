import { Interaction } from "@/definitions";
import { IconButton, Tooltip, Typography, TableCell, TableRow, Stack } from "@mui/material";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { ArrowDownwardIcon, ArrowUpwardIcon, ClearIcon, EditIcon } from "../material-icons";
import { getConsequenceIcon } from "../SequenceEditor/get-icons";
import { ConsequenceIcon } from "../SequenceEditor/ConsequenceCard";

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
        consequences, flagsThatMustBeFalse = [], flagsThatMustBeTrue = []
    } = interaction

    const trueFlagText = flagsThatMustBeTrue.length ? `x${flagsThatMustBeTrue.length}` : ''
    const trueFlagTitle = flagsThatMustBeTrue.join(", ")

    const falseFlagText = flagsThatMustBeFalse.length ? `x${flagsThatMustBeFalse.length}` : ''
    const falseFlagTitle = flagsThatMustBeFalse.join(", ")

    const consequenceText = consequences.length ? `x${consequences.length}` : 'empty'
    const consequenceTitle = consequences.map(_ => _.type).join(", ")

    const consequenceIcons = consequences.map(consequence => getConsequenceIcon(consequence))

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
                {consequences.map((consequence, index) => <ConsequenceIcon key={index} consequence={consequence} />)}
            </TableCell>
            <TableCell align='center' >
                <Tooltip title={trueFlagTitle}>
                    <Typography>{trueFlagText}</Typography>
                </Tooltip>
            </TableCell>
            <TableCell align='center'>
                <Tooltip title={falseFlagTitle}>
                    <Typography>{falseFlagText}</Typography>
                </Tooltip>
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