import { ActorData, SoundValue } from "@/definitions";
import React from "react";
import { RecordEditor } from "../RecordEditor";
import { SoundValueForm } from "./SoundValueForm";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { useGameDesign } from "@/context/game-design-context";
import soundService from "@/services/soundService";

interface Props {
    actor: ActorData
    changeSoundMap: { (key: string, value?: SoundValue): void }
}

const newSound = (): SoundValue => ({ soundId: soundService.list()[0] })

export const AnimationSounds: React.FunctionComponent<Props> = ({ actor, changeSoundMap }) => {
    const { gameDesign } = useGameDesign()
    const { soundEffectMap = {} } = actor
    const statusSuggestions = getStatusSuggestions(actor.id, gameDesign)

    return <RecordEditor
        record={soundEffectMap}
        addEntryLabel={'Pick animation to add sound effect for'}
        describeValue={(key, value) =>
            <SoundValueForm
                animation={key}
                data={value}
                updateData={(data) => { changeSoundMap(key, data) }}
            />
        }
        setEntry={(key, value) => { changeSoundMap(key, value) }}
        addEntry={(key) => { changeSoundMap(key, newSound()) }}
        newKeySuggestions={statusSuggestions}
    />

}