import { Verb } from "@/definitions";
import DirectionsWalk from "@mui/icons-material/DirectionsWalk";
import PanToolIcon from '@mui/icons-material/PanTool';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import { Button, IconButton } from "@mui/material";
import React, { MouseEventHandler } from "react";


interface Props {
    verb: Verb
    isActive?: boolean
    handleClick: { (verb: Verb): void }
    disabled?: boolean
    tiny?: boolean
    prepositionLabel?: boolean
    useIcons?: boolean
}



const iconMap: Record<string, typeof PanToolIcon> = {
    WALK: DirectionsWalk,
    LOOK: VisibilityIcon,
    USE: PanToolIcon,
}

export const canUseIcons = (verbs: Verb[]) =>
    verbs.map(v => v.id).every(verbId => Object.keys(iconMap).includes(verbId))


export const VerbButton: React.FunctionComponent<Props> = ({
    verb, isActive, handleClick, disabled, tiny, prepositionLabel, useIcons
}) => {

    const buttonText = prepositionLabel ? `${verb.label} item ${verb.preposition ?? 'with'}` : verb.label;

    const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation()
        event.preventDefault()
        handleClick(verb)
    }

    if (useIcons) {
        const Icon = prepositionLabel ? InventoryIcon : iconMap[verb.id] ?? PanToolIcon;
        return <IconButton
            size="small"
            disabled={disabled}
            title={buttonText}
            onClick={onClick}>
            <Icon color={isActive ? 'primary' : undefined} />
        </IconButton>
    }


    return <Button
        size="small"
        sx={{
            textTransform: 'none',
            lineHeight: 1,
            padding: '1px 3px',
            minWidth: tiny ? 40 : 64,
            minHeight: tiny ? 32 : 32,
        }}
        disabled={disabled}
        variant={isActive ? 'contained' : 'outlined'}
        onClick={onClick}>
        {buttonText}
    </Button>
}