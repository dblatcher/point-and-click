import { useGameState, useGameStateDerivations } from "@/context/game-state-context";
import React from "react";
import { VERB_BUTTON_SIZE } from "./styles";
import { VerbButton } from "./VerbButton";
import { Verb } from "@/definitions";

interface Props {
    activeVerbId?: string,
    selectVerb: { (verb: Verb): void },
}

const FOR_ITEMS = true

export const VerbList: React.FunctionComponent<Props> = ({ activeVerbId, selectVerb }) => {

    const { gameProps, } = useGameState()
    const { isConversationRunning } = useGameStateDerivations()
    const { verbs } = gameProps
    const relevantVerbs = FOR_ITEMS ? verbs.filter(verb => !verb.isMoveVerb && !verb.isNotForItems) : verbs;



    if (isConversationRunning) {
        return null
    }

    return <div style={{
        backgroundColor: 'black',
        position: 'relative',
        pointerEvents: 'all',
        fontSize: 8,
        maxWidth: VERB_BUTTON_SIZE * (Math.max(relevantVerbs.length, 5))
    }}>
        <div style={{ display: 'flex' }}>
            {relevantVerbs.map(verb => (
                <VerbButton key={verb.id}
                    verb={verb}
                    isActive={verb.id === activeVerbId}
                    handleClick={selectVerb} />
            ))}
        </div>


    </div>
}
