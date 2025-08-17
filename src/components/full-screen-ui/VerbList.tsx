import { useGameState } from "@/context/game-state-context";
import { Verb } from "@/definitions";
import { Box } from "@mui/material";
import React from "react";
import { canUseIcons, VerbButton } from "./VerbButton";

interface Props {
    activeVerbId?: string,
    selectVerb: { (verb: Verb): void },
    disabled?: boolean
}



export const InventoryVerbList: React.FunctionComponent<Props> = ({ activeVerbId, selectVerb, disabled }) => {
    const { gameProps, } = useGameState()
    const { verbs } = gameProps
    const relevantVerbs = verbs.filter(verb => !verb.isMoveVerb && !verb.isNotForItems);

    return (
        <Box display={'flex'}>
            {relevantVerbs.map(verb => (
                <VerbButton key={verb.id}
                    disabled={disabled}
                    verb={verb}
                    isActive={verb.id === activeVerbId}
                    useIcons={canUseIcons(relevantVerbs)}
                    handleClick={selectVerb} />
            ))}
        </Box>
    )
}
