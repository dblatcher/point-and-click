import { useGameDesign } from "@/context/game-design-context"
import { formatIdInput } from "./helpers"
import { AddIcon } from "./material-icons"
import { makeNewFlag } from "./defaults"
import { FlagMap } from "point-click-lib"
import { ButtonWithTextInput } from "./ButtonWithTextInput"


export const NewFlagButton = ({
    keyboardShortcut,
    afterAdd
}: {
    keyboardShortcut?: string;
    afterAdd?: { (key: string): void }
}) => {

    const { gameDesign, applyModification } = useGameDesign()

    const addEntry = (key: string) => {
        const mod: Partial<FlagMap> = {}
        mod[key] = makeNewFlag()
        applyModification(`Add new flag ${key}`, { flagMap: { ...gameDesign.flagMap, ...mod } })
        afterAdd?.(key);
    }

    const flagList = Object.entries(gameDesign.flagMap).flatMap(([key, flag]) => {
        return flag ? { key, flag } : []
    })

    return <ButtonWithTextInput
        label={`Add new flag`}
        onEntry={addEntry}
        modifyInput={formatIdInput}
        clearOnOpen
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
        keyboardShortcut={keyboardShortcut}
    />
}