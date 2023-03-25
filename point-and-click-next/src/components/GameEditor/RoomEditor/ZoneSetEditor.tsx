import { FunctionComponent } from "react";
import { Zone } from "@/oldsrc";
import { TabSet } from "@/oldsrc/components/TabSet";
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
        <>
        {zones.length === 0 && <span>No <b>{type}s</b> for this room yet. Select a shape from the menu to the left to add one.</span>}
        <TabSet
            openIndex={openTab}
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
        </>
    )
}