import { AddIcon } from "@/components/GameEditor/material-icons";
import { Button, ButtonGroup, ButtonGroupProps } from "@mui/material";
import { FunctionComponent } from "react";
import { ClickEffect, useRoomClickEffect } from "../ClickEffect";
import { SupportedZoneShape } from "@/definitions";

interface Props {
    type: 'obstacle' | 'walkable' | 'hotspot';
    orientation?: ButtonGroupProps['orientation']
}

export const NewZoneButtons: FunctionComponent<Props> = ({
    type,
    orientation = 'horizontal'
}: Props) => {

    const { setClickEffect, clickEffect } = useRoomClickEffect()

    const clickEffectIsNewZone = (shapeToCheck: 'circle' | 'rect' | 'polygon'): boolean => {
        if (!clickEffect) { return false }
        if (!('shape' in clickEffect)) { return false }
        return (clickEffect.shape === shapeToCheck && clickEffect.type == 'ADD_NEW' && clickEffect.shape === shapeToCheck)
    }

    const makeEffectForNew = (shape: SupportedZoneShape): ClickEffect => {
        return {
            type: 'ADD_NEW',
            zoneType: type,
            shape,
        }
    }

    return (
        <ButtonGroup sx={{ paddingBottom: 1 }} size="small" orientation={orientation}>
            <Button
                variant={clickEffectIsNewZone('circle') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    setClickEffect(makeEffectForNew('circle'))
                }}>circle</Button>
            <Button
                variant={clickEffectIsNewZone('rect') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    setClickEffect(makeEffectForNew('rect'))
                }}>Rectangle</Button>
            <Button
                variant={clickEffectIsNewZone('polygon') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    setClickEffect(makeEffectForNew('polygon'))
                }}>Polygon</Button>
        </ButtonGroup>

    )
}