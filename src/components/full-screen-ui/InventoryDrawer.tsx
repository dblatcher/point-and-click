import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { ItemData, Verb } from "@/definitions";
import { findById } from "@/lib/util";
import { Box, Button, Dialog, DialogContent } from "@mui/material";
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
            <DialogContent >
                <Box display='flex'>
                    {inventory.map(item => (
                        <Button size="small" key={item.id}
                            variant={(activeItemId === item.id) ? 'contained' : 'outlined'}
                            onClick={() => selectItem(item)}
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
                {activeItemId && (
                    <VerbList activeVerbId={activeVerbId} selectVerb={selectVerb} />
                )}
            </DialogContent>
        </Dialog>)
}