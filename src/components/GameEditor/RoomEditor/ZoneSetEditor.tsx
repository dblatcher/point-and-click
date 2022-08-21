import { h, FunctionComponent } from "preact";
import { Zone } from "src";
import { TabMenu } from "../../TabMenu";
import { ClickEffect } from "./ClickEffect";
import { ShapeChangeFunction, ValidShapeType } from "./ShapeControl";
import { ZoneControl } from "./ZoneControl";

interface Props {
    type: 'obstacle' | 'walkable';
    zones: Zone[];
    change: ShapeChangeFunction;
    remove: { (index: number, type: ValidShapeType): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
    openTab?: number;
}

export const ZoneSetEditor: FunctionComponent<Props> = ({
    type,
    zones,
    change,
    remove,
    setClickEffect,
    openTab = 0,
}: Props) => {

    return (
        <TabMenu noButtons
            defaultOpenIndex={openTab}
            tabs={
                zones.map((obstacle, index) => {
                    return {
                        label: obstacle.ref || `${type} #${index}`, content: (
                            <ZoneControl
                                zone={obstacle}
                                index={index}
                                type={type}
                                setClickEffect={setClickEffect}
                                change={change}
                                remove={remove} />
                        )
                    }
                })
            }
        />
    )
}