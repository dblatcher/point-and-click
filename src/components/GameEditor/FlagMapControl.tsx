import { useGameDesign } from "@/context/game-design-context";
import { findFlagUsages, getModificationToRemoveFlagAndReferences } from "@/lib/find-uses";
import { Box, Divider, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { Flag } from "point-click-lib";
import { ButtonWithConfirm } from "./ButtonWithConfirm";
import { DelayedStringInput } from "./DelayedStringInput";
import { DeleteIcon, FlagFilledIcon, FlagOutlinedIcon } from "./material-icons";
import { NewFlagButton } from "./NewFlagButton";


interface Props {
    forModifier?: boolean
}

export const FlagMapControl = ({ forModifier = false }: Props) => {
    const { gameDesign } = useGameDesign()

    const flagList = Object.entries(gameDesign.flagMap).flatMap(([key, flag]) => {
        return flag ? { key, flag } : []
    })

    return <>
        <Stack spacing={2} divider={<Divider />} minWidth={250}>
            {flagList.map(({ key, flag }) => (
                <FlagCard id={key} flag={flag} key={key} forModifier={forModifier} />
            ))}
        </Stack>

        {!forModifier && (
            <NewFlagButton keyboardShortcut="#" />
        )}
    </>
};

const FlagCard = ({ id, flag, forModifier }: { id: string, flag: Flag, forModifier: boolean }) => {
    const { gameDesign, applyModification } = useGameDesign()
    const toggleValue = () => {
        applyModification(`toggle value on flag ${id}`, {
            flagMap: {
                ...gameDesign.flagMap,
                [id]: { ...flag, value: !flag.value, default: !flag.value }
            }
        })
    }
    const setDescription = (description: string) => {
        applyModification(`change description on flag ${id}`, {
            flagMap: {
                ...gameDesign.flagMap,
                [id]: { ...flag, description }
            }
        })
    }
    const deleteFlag = () => {
        applyModification(`delete flag ${id}`,
            getModificationToRemoveFlagAndReferences(id, gameDesign)
        )
    }

    const { conversationsWithFlag, sequencesWithFlag, interactionsWithFlagConditions, interactionsWithFlagConsequences } = findFlagUsages(gameDesign, id)

    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                    {flag.value ? <FlagFilledIcon /> : <FlagOutlinedIcon />}
                    <Typography variant='subtitle1'>{id}</Typography>
                </Box>
                <FormControlLabel
                    label={`starts ${flag.value ? 'on' : 'off'}`}
                    labelPlacement="start"
                    control={<Switch
                        size="small"
                        checked={flag.value}
                        onChange={toggleValue}
                        color="primary" />}
                />
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
                <DelayedStringInput readOnly={forModifier}
                    label="description"
                    value={flag.description ?? ''}
                    inputHandler={setDescription} />
                {!forModifier && (
                    <ButtonWithConfirm
                        confirmationText={`Are you sure you want to delete flag "${id}"?`}
                        label="delete"
                        useIconButton
                        icon={<DeleteIcon color="warning" />}
                        onClick={deleteFlag}
                    >
                        <Typography>Referenced in:</Typography>
                        <Typography>{interactionsWithFlagConditions.length} interactions as condition</Typography>
                        <Typography>{interactionsWithFlagConsequences.length} interactions with flag consequences</Typography>
                        <Typography>{sequencesWithFlag.length} sequences with flag consequences</Typography>
                        <Typography>{conversationsWithFlag.length} conversation sequences with flag consequences</Typography>
                    </ButtonWithConfirm>
                )}
            </Box>
        </Box >
    )
}