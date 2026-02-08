import { IntermitentSound } from "@/components/sound/IntermitentSound";
import { PersistentSound } from "@/components/sound/PersistentSound";
import { SoundValue } from "point-click-lib";

interface Props {
    soundValues: SoundValue[];
    isPaused: boolean;
    frameIndex?: number;
}



export const SoundHandler = ({
    soundValues,
    isPaused,
    frameIndex,
}: Props) => {
    const persistentSoundValues = soundValues.filter(sv => typeof sv.frameIndex === 'undefined')
    const intermittentSoundValues = soundValues.filter(sv => typeof sv.frameIndex === 'number')

    return <>
        {persistentSoundValues.map((soundValue, index) =>
            <PersistentSound
                key={index}
                soundValue={soundValue}
                isPaused={isPaused} />)}
        {intermittentSoundValues.map((soundValue, index) => (
            <IntermitentSound
                key={index}
                frameIndex={frameIndex}
                soundValue={soundValue}
                isPaused={isPaused} />
        ))}
    </>
}