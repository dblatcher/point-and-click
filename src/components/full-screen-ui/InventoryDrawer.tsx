import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { ItemData, Verb } from "@/definitions";
import { findById } from "@/lib/util";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { ItemButton } from "./ItemButton";
import { VerbList } from "./VerbList";

interface Props {
    closeDialog: { (): void }
}


export const InventoryDrawer: React.FunctionComponent<Props> = ({ closeDialog }) => {
    const { updateGameState, gameProps } = useGameState()
    const { inventory, lookVerb } = useGameStateDerivations()

    const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined)
    const [activeVerbId, setActiveVerbId] = useState<string | undefined>(undefined)

    const selectItem = (item: ItemData) => {

        if (item.id === activeItemId) {
            setActiveItemId(undefined)
            setActiveVerbId(undefined)
            return
        }

        if (!activeItemId || !activeVerbId) {
            setActiveItemId(item.id)
            return
        }

        const firstItem = findById(activeItemId, inventory)
        const verb = findById(activeVerbId, gameProps.verbs)

        if (!firstItem || !verb) {
            return
        }

        closeDialog()
        updateGameState({ type: 'SEND-COMMAND', command: { verb, target: item, item: firstItem } })
    }

    const examineItem = (item: ItemData) => {
        if (lookVerb) {
            closeDialog()
            updateGameState({ type: 'SEND-COMMAND', command: { verb: lookVerb, target: item } })
        }
    }

    const selectVerb = (verb: Verb) => {
        if (!verb.preposition) {
            const item = findById(activeItemId, inventory)
            if (item) {
                closeDialog()
                updateGameState({ type: 'SEND-COMMAND', command: { verb, target: item } })
            }
            setActiveVerbId(undefined)
            return
        }
        setActiveVerbId(verb.id)
    }

    const item = findById(activeItemId, inventory)
    const verb = findById(activeVerbId, gameProps.verbs)

    const command = item && verb
        ? `${verb.label} ${item.name ?? item.id} ${verb.preposition ?? ''}...`
        : item ? `... ${item.name ?? item.id}` : "...";

    return (
        <Dialog open onClose={closeDialog}>
            <DialogTitle>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography>Inventory</Typography>
                    <IconButton onClick={closeDialog} size="small">x</IconButton>
                </Box>
            </DialogTitle>
            <DialogContent >
                <Box display='flex' flexWrap={'wrap'}>
                    {inventory.map(item => (
                        <ItemButton key={item.id}
                            item={item}
                            isActive={activeItemId === item.id}
                            handleClick={selectItem}
                            handleContextClick={examineItem} />
                    ))}
                </Box>
                <VerbList activeVerbId={activeVerbId} selectVerb={selectVerb} disabled={!activeItemId} />
                <Typography>{command}</Typography>
            </DialogContent>
        </Dialog>)
}