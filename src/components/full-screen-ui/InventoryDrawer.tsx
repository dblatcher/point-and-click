import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { ItemData, Verb } from "@/definitions";
import { findById } from "@/lib/util";
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Card, Fade, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { ItemButton } from "./ItemButton";
import { InventoryVerbList } from "./VerbList";
import { matchInteraction } from "@/lib/commandFunctions";

interface Props {
    remove: { (): void }
    isShowing: boolean
}


export const InventoryDrawer: React.FunctionComponent<Props> = ({ remove, isShowing }) => {
    const { updateGameState, gameProps, gameState } = useGameState()
    const { inventory, lookVerb } = useGameStateDerivations()

    const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined)
    const [activeVerbId, setActiveVerbId] = useState<string | undefined>(undefined)

    const closeAndReset = () => {
        setActiveItemId(undefined)
        setActiveVerbId(undefined)
        remove()
    }

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

        closeAndReset()
        updateGameState({ type: 'SEND-COMMAND', command: { verb, target: item, item: firstItem } })
    }

    const examineItem = (item: ItemData) => {
        if (lookVerb) {
            closeAndReset()
            updateGameState({ type: 'SEND-COMMAND', command: { verb: lookVerb, target: item } })
        }
    }

    const selectVerb = (verb: Verb) => {
        const item = findById(activeItemId, inventory)
        const currentRoom = findById(gameState.currentRoomId, gameState.rooms);
        if (!item) { return }

        const isCompleteInteraction = !verb.preposition ||
            (currentRoom && matchInteraction({ verb, target: item }, currentRoom, gameState.interactions, gameState));

        if (isCompleteInteraction) {
            closeAndReset()
            updateGameState({ type: 'SEND-COMMAND', command: { verb, target: item } })
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
        <Fade in={isShowing}>
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }} onClick={closeAndReset}>
                <Box component={Card} padding={2} maxWidth={500}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography>Inventory</Typography>
                        <IconButton onClick={closeAndReset} size="small"><ClearIcon /></IconButton>
                    </Box>
                    <Box display='flex' flexWrap={'wrap'}>
                        {inventory.map(item => (
                            <ItemButton key={item.id}
                                item={item}
                                isActive={activeItemId === item.id}
                                handleClick={selectItem}
                                handleContextClick={examineItem} />
                        ))}
                    </Box>
                    <InventoryVerbList activeVerbId={activeVerbId} selectVerb={selectVerb} disabled={!activeItemId} />
                    <Typography>{command}</Typography>
                </Box>
            </div>
        </Fade>
    )
}