import { useGameDesign } from "@/context/game-design-context";
import { ActorData, SoundValue } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import soundService from "@/services/soundService";
import { Box, Typography } from "@mui/material";
import React from "react";
import { SpritePreview } from "../SpritePreview";
import { SoundValueForm } from "./SoundValueForm";

interface Props {
    actor: ActorData
    changeSoundMap: { (key: string, value?: SoundValue[]): void }
}

const newSound = (): SoundValue => ({ soundId: soundService.list()[0] })

const toSoundValueArray = (input: SoundValue | SoundValue[] | undefined): SoundValue[] => {
    if (!input) {
        return []
    }
    return Array.isArray(input) ? input : [input]
}

export const AnimationSounds: React.FunctionComponent<Props> = ({ actor, changeSoundMap }) => {
    const { gameDesign } = useGameDesign()
    const { soundEffectMap = {} } = actor
    const statusSuggestions = getStatusSuggestions(actor.id, gameDesign)


    return <Box>

        {statusSuggestions.map(animation => {

            const sounds = toSoundValueArray(soundEffectMap[animation])

            return <Box key={animation}>
                <Typography>{animation}</Typography>
                <SpritePreview data={actor} animation={animation} scale={.5} noBaseLine />
                {sounds.map( (soundValue,index) => <SoundValueForm  key={index} 
                    animation={animation} 
                    data={soundValue} 
                    updateData={(update)=>{
                        console.log(animation, index, update)
                    }} />
                 )}
            </Box>
        })}
    </Box>

    // return <RecordEditor
    //     record={soundEffectMap}
    //     addEntryLabel={'Pick animation to add sound effect for'}
    //     describeValue={(key, value) =>
    //         <SoundValueForm
    //             animation={key}
    //             data={value}
    //             updateData={(data) => { changeSoundMap(key, data) }}
    //         />
    //     }
    //     setEntry={(key, value) => { changeSoundMap(key, value) }}
    //     addEntry={(key) => { changeSoundMap(key, newSound()) }}
    //     newKeySuggestions={statusSuggestions}
    // />

}