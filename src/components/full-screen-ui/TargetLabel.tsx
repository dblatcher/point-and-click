import { ActorData, HotspotZone } from "point-click-lib";
import React, { useEffect, useState } from "react";

interface Props {
    target: ActorData | HotspotZone
}

export const TargetLabel: React.FunctionComponent<Props> = ({ target }) => {
    const label = target?.name ?? target?.id;
    const [fontSize, setFontSize] = useState(6)

    const startAnimation = () => {
        let size = 6
        const grow = () => {
            size += .1;
            setFontSize(size)
            if (size < 10) {
                setTimeout(grow, 5)
            }
        }
        grow()
    }
    useEffect(startAnimation, [target])

    return (
        <text
            style={{
                filter: "drop-shadow(1px 1px 0px white) drop-shadow(-1px -1px 0px white) drop-shadow(0px 0px 2px white)",
            }}
            filter="url(#solid)"
            x={0}
            y={0}
            alignmentBaseline="hanging"
            fontSize={fontSize}
            fontWeight={700}
            fontFamily="arial, sans-serif"
        >{label}</text>
    )
}
