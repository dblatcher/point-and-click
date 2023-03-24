import { FunctionComponent } from "react";
import { SoundValue, SoundValueSchema } from "../../../definitions/ActorData";
import soundService from "@/services/soundService";
import { getModification, SchemaForm } from "../SchemaForm";


interface Props {
    animation: string;
    data: SoundValue;
    updateData: { (data: SoundValue): void };
}

export const SoundValueForm: FunctionComponent<Props> = ({ animation, data, updateData }) => {

    return (
        <div>
            <b>{animation}: </b>

            <SchemaForm schema={SoundValueSchema}
                options={{ soundId: soundService.list() }}
                numberConfig={{ volume: { max: 2, step: .1 } }}
                data={data}
                changeValue={(value, field): void => {
                    return updateData(
                        Object.assign({}, data, getModification(value, field))
                    )
                }}
            />
        </div>
    )
}
