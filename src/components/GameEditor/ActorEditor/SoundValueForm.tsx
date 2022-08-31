import { FunctionComponent, h } from "preact";
import { SoundValue } from "src/definitions/ActorData";
import soundService from "../../../services/soundService";
import { SelectInput } from "../formControls";


interface Props {
    animation: string;
    data: SoundValue;
    updateData: { (data: SoundValue): void };
}

export const SoundValueForm: FunctionComponent<Props> = ({ animation, data, updateData }) => {

    const [soundId] = data

    const handleUpdate = (value: string): void => {
        console.log(value)
        return updateData([value])
    }

    return (
        <div>
            <span>{animation}: </span>
            <SelectInput 
                value={soundId} 
                items={soundService.list()} 
                onSelect={handleUpdate} />
        </div>
    )
}
