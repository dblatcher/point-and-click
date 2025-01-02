import { useGameState } from "@/context/game-state-context";
import { Verb } from "@/definitions";
import { ButtonGroup } from "@mui/material";
import React from "react";
import { VerbButton } from "./VerbButton";

interface Props {
    activeVerbId?: string,
    selectVerb: { (verb: Verb): void },
    disabled?: boolean
}


export const VerbList: React.FunctionComponent<Props> = ({ activeVerbId, selectVerb, disabled }) => {

    const { gameProps, } = useGameState()
    const { verbs } = gameProps
    const relevantVerbs = verbs.filter(verb => !verb.isMoveVerb && !verb.isNotForItems);

    return (
        <ButtonGroup>
            {relevantVerbs.map(verb => (
                <VerbButton key={verb.id}
                    disabled={disabled}
                    verb={verb}
                    isActive={verb.id === activeVerbId}
                    handleClick={selectVerb} />
            ))}
        </ButtonGroup>
    )
}
