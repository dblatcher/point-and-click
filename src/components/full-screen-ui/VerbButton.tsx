import { Verb } from "@/definitions";
import { Button } from "@mui/material";
import React from "react";

interface Props {
    verb: Verb
    isActive?: boolean
    handleClick: { (verb: Verb): void }
    disabled?: boolean
    tiny?: boolean
    prepositionLabel?: boolean
}


export const VerbButton: React.FunctionComponent<Props> = ({ verb, isActive, handleClick, disabled, tiny, prepositionLabel }) => {

    const buttonText = prepositionLabel ? `${verb.label} item ${verb.preposition ?? 'with'}` : verb.label;

    return <Button
        size="small"
        sx={{
            textTransform: 'none',
            padding: tiny ? '1px 3px' : undefined,
            minWidth: tiny ? 32 : undefined,
        }}
        disabled={disabled}
        variant={isActive ? 'contained' : 'outlined'}
        onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            handleClick(verb)
        }}>
        {buttonText}
    </Button>
}