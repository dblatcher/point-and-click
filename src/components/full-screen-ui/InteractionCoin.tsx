import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import { CommandTarget, ItemData, Verb } from "@/definitions";
import { Box, Button, ButtonGroup, Card, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
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

    return <Box
        display={'flex'}
        flexDirection={'column'}
        component={Card}
        padding={1}
    >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography>
                {target.name ?? target.id}
                {activeItemVerb && `: ${activeItemVerb.label} item`}
            </Typography>
            <IconButton onClick={remove} size="small">x</IconButton>
        </Box>

        {!activeItemVerb ? (<>
            <ButtonGroup>
                {directVerbs.map(verb => (
                    <VerbButton key={verb.id} tiny
                        verb={verb}
                        handleClick={(verb) => handleDirectVerbClick(verb)} />
                ))}
            </ButtonGroup >
            <ButtonGroup>
                {itemVerbs.map(verb => (
                    <VerbButton key={verb.id} tiny prepositionLabel
                        verb={verb}
                        handleClick={(verb) => handleItemVerbClick(verb)} />
                ))}
            </ButtonGroup>
        </>) : (
            <ButtonGroup>
                {inventory.map(item => (
                    <Button key={item.id}
                        disabled={!activeItemVerb}
                        onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleItemClick(item)
                        }}>
                        {item.id}
                    </Button>
                ))}
            </ButtonGroup>
        )}
    </Box>
}
