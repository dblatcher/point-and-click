import { Interaction } from "@/definitions";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import styles from './styles.module.css';

interface Props {
    index: number;
    interaction: Interaction;
    changeOrder: { (index: number, direction: 'up' | 'down'): void }
    deleteInteraction: { (index: number): void }
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

    return (
        <tr key={index}>
            <td>
                <Typography>{verbId}</Typography>
            </td>
            <td>
                <Typography>{targetId}</Typography>
                {targetStatus && <Typography>({targetStatus})</Typography>}
            </td>
            <td>
                <Typography>{itemId}</Typography>
            </td>
            <td>
                <Typography>{roomId}</Typography>
            </td>
            <td className={styles.centered} >
                <Tooltip title={consequenceTitle}>
                    <Typography>{consequenceText}</Typography>
                </Tooltip>
            </td>
            <td className={styles.centered} >
                <Tooltip title={trueFlagTitle}>
                    <Typography>{trueFlagText}</Typography>
                </Tooltip>
            </td>
            <td className={styles.centered}>
                <Tooltip title={falseFlagTitle}>
                    <Typography>{falseFlagText}</Typography>
                </Tooltip>
            </td>
            <td>
                <IconButton
                    onClick={openEditor}>
                    <EditIcon color="primary" />
                </IconButton>
            </td>
            <td>
                <IconButton onClick={() => changeOrder(index, 'up')}>
                    <ArrowUpwardIcon />
                </IconButton>
            </td>
            <td>
                <IconButton onClick={() => changeOrder(index, 'down')}>
                    <ArrowDownwardIcon />
                </IconButton>
            </td>
            <td>
                <ButtonWithConfirm
                    useIconButton={true}
                    icon={<ClearIcon />}
                    label="delete this interaction"
                    onClick={() => { deleteInteraction(index) }}
                />
            </td>
        </tr>
    )

}