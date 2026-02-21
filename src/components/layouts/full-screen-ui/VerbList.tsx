import { Box } from "@mui/material";
import { GameDataContext } from "point-click-components";
import { Verb } from "point-click-lib";
import React, { useContext } from "react";
import { canUseIcons, VerbButton } from "./VerbButton";

interface Props {
    activeVerbId?: string,
    selectVerb: { (verb: Verb): void },
    disabled?: boolean
}



export const InventoryVerbList: React.FunctionComponent<Props> = ({ activeVerbId, selectVerb, disabled }) => {
    const { gameDesign, } = useContext(GameDataContext)
    const { verbs } = gameDesign
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
