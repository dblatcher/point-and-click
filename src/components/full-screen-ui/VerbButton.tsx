import { CommandTarget, Verb } from "@/definitions";
import React from "react";
import { verbButtonStyle } from "./styles";

interface Props {
    verb: Verb
    isActive?: boolean
    handleClick:{(verb: Verb):void}
}


export const VerbButton: React.FunctionComponent<Props> = ({ verb, isActive, handleClick }) => {

    return <button
        style={{
            ...verbButtonStyle,
            backgroundColor: isActive ? 'red' : undefined
        }}
        onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            handleClick(verb)
        }}>
        {verb.label.substring(0, 4)}
    </button>
}