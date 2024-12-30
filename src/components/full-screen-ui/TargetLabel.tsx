import { ActorData, HotspotZone } from "@/definitions";
import React from "react";


interface Props {
    target: ActorData | HotspotZone
}

export const TargetLabel: React.FunctionComponent<Props> = ({ target }) => {

    return (
        <text
            x={0}
            y={0}
            alignmentBaseline="central"
            fontSize={10}
        >{target?.name ?? target?.id}</text>
    )
}