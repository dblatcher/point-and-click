/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { Consequence } from "../../../definitions/Interaction";
import { GameCondition } from "../../../definitions/Game";
import { SelectInput } from "../formControls";

interface Props {
    consequence: Consequence;
    gameDesign: Omit<GameCondition, 'characterOrders' | 'sequenceRunning'>;
    edit: { (property: string, value: unknown): void };
}


export const ConsequenceForm: FunctionalComponent<Props> = ({ consequence, gameDesign, edit }: Props) => {

    return <div>
        <span>type: {consequence.type}</span>
        <SelectInput value={consequence.type} 
            items={['talk','order','sequence']}
            onSelect={(value)=>{ edit('type',value)}}
            />
    </div>

}
