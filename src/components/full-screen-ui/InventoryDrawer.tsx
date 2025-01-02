import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { ItemData, Verb } from "@/definitions";
import { findById } from "@/lib/util";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { ImageBlock } from "../ImageBlock";
import { VerbList } from "./VerbList";

interface Props {
    closeDialog: { (): void }
}


export const InventoryDrawer: React.FunctionComponent<Props> = ({ closeDialog }) => {
    const { updateGameState, gameProps } = useGameState()
    const { inventory } = useGameStateDerivations()

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
        const lookVerb = gameProps.verbs.find(verb => verb.isLookVerb)
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

    return (
        <Dialog open onClose={closeDialog}>
            <DialogTitle>Inventory</DialogTitle>
            <DialogContent >
                <Box display='flex' flexWrap={'wrap'}>
                    {inventory.map(item => (
                        <Button size="small" key={item.id}
                            variant={(activeItemId === item.id) ? 'contained' : 'outlined'}
                            onClick={() => selectItem(item)}
                            onContextMenu={(event) => {
                                event.preventDefault()
                                examineItem(item)
                            }}
                            sx={{
                                height: '4rem'
                            }}
                        >
                            {item.imageId
                                ? <ImageBlock frame={{ imageId: item.imageId, row: item.row, col: item.col }} />
                                : <span>{item.name || item.id}</span>
                            }
                        </Button>
                    ))}
                </Box>
                <VerbList activeVerbId={activeVerbId} selectVerb={selectVerb} disabled={!activeItemId} />
            </DialogContent>
        </Dialog>)
}