import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { CommandTarget, ItemData, Verb } from "@/definitions";
import { Box, ButtonGroup, Card, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { ItemButton } from "./ItemButton";
import { VerbButton } from "./VerbButton";

interface Props {
    target: CommandTarget,
    remove: { (): void }
}


export const InteractionCoin: React.FunctionComponent<Props> = ({ target, remove }) => {
    const { gameProps, updateGameState } = useGameState()
    const { inventory, isConversationRunning } = useGameStateDerivations()
    const { verbs } = gameProps
    const [activeItemVerb, setActiveItemVerb] = useState<Verb | undefined>(undefined)
    const directVerbs = verbs.filter(verb => !verb.requiresItem);
    const itemVerbs = verbs.filter(verb => verb.preposition && !verb.isMoveVerb)
    const handleItemVerbClick = (verb: Verb) => {
        setActiveItemVerb(verb)
        return
    }

    const handleDirectVerbClick = (verb: Verb) => {
        remove()
        updateGameState({
            type: 'SEND-COMMAND',
            command: {
                target,
                verb
            }
        })
    }

    const handleItemClick = (item: ItemData) => {
        if (!activeItemVerb) {
            return
        }
        setActiveItemVerb(undefined)
        remove()
        updateGameState({
            type: 'SEND-COMMAND',
            command: {
                target,
                verb: activeItemVerb,
                item,
            }
        })
    }

    if (isConversationRunning) {
        return null
    }

    const command = activeItemVerb
        ? `${activeItemVerb.label} ... ${activeItemVerb.preposition ?? 'with'} ${target.name ?? target.id}`
        : target.name ?? target.id

    return <Box
        display={'flex'}
        flexDirection={'column'}
        component={Card}
        padding={1}
        maxWidth={400}
    >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography>{command}</Typography>
            <IconButton onClick={remove} size="small">x</IconButton>
        </Box>

        {!activeItemVerb ? (<>
            <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexWrap={'wrap'}>
                {directVerbs.map(verb => (
                    <VerbButton key={verb.id} tiny
                        verb={verb}
                        handleClick={(verb) => handleDirectVerbClick(verb)} />
                ))}
            </Box >
            <Box display={'flex'} justifyContent={'space-around'} alignItems={'center'} flexWrap={'wrap'}>
                {itemVerbs.map(verb => (
                    <VerbButton key={verb.id} tiny prepositionLabel
                        verb={verb}
                        disabled={inventory.length === 0}
                        handleClick={(verb) => handleItemVerbClick(verb)} />
                ))}
            </Box>
        </>) : (
            <Box display={'flex'} flexWrap={'wrap'}>
                {inventory.map(item => (
                    <ItemButton key={item.id} tiny
                        item={item}
                        disabled={!activeItemVerb}
                        handleClick={handleItemClick}
                    />
                ))}
            </Box>
        )}
    </Box>
}
