import { useGameDesign } from "@/context/game-design-context";
import { Flag, FlagMap } from "@/definitions/Flag";
import { Box, Divider, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { ButtonWithConfirm } from "./ButtonWithConfirm";
import { ButtonWithTextInput } from "./ButtonWithTextInput";
import { makeNewFlag } from "./defaults";
import { formatIdInput } from "./helpers";
import { AddIcon, DeleteIcon, FlagFilledIcon, FlagOutlinedIcon } from "./material-icons";
import { findFlagUsages, getModificationToRemoveFlagAndReferences } from "@/lib/find-uses";
import { DelayedStringInput } from "./DelayedStringInput";


interface Props {
    forModifier?: boolean
}

export const FlagMapControl = ({ forModifier = false }: Props) => {
    const { gameDesign, applyModification } = useGameDesign()

    const addEntry = (key: string) => {
        const mod: Partial<FlagMap> = {}
        mod[key] = makeNewFlag()
        return applyModification(`Add new flag ${key}`, { flagMap: { ...gameDesign.flagMap, ...mod } })
    }

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
            <ButtonWithTextInput
                label={`Add new flag`}
                onEntry={addEntry}
                modifyInput={formatIdInput}
                buttonProps={{
                    startIcon: <AddIcon />,
                    variant: 'contained',
                    sx: { width: '100%' },
                }}
                getError={input => {
                    if (flagList.some(item => item.key === input)) {
                        return `there is already a flag called ${input}`
                    }
                    return undefined
                }}
                dialogTitle={`Enter flag name`}
                keyboardShortcut={forModifier ? undefined : "#"}
            />
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
                    style={{
                        margin: 0
                    }}
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