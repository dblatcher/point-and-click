import { FunctionComponent } from "react";
import { ClickEffect } from "./ClickEffect";
import { ButtonGroup, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"

interface Props {
    type: 'obstacle' | 'walkable' | 'hotspot';
    clickEffect?: ClickEffect;
    setClickEffect: { (clickEffect: ClickEffect): void }
}

export const NewZoneButtons: FunctionComponent<Props> = ({
    type,
    clickEffect,
    setClickEffect,
}: Props) => {

    const clickEffectIsNewZone = (shapeToCheck: 'circle' | 'rect' | 'polygon'): boolean => {
        if (!clickEffect) { return false }
        if (!('shape' in clickEffect)) { return false }
        return (clickEffect.shape === shapeToCheck && clickEffect.type == type.toUpperCase())
    }

    const effectType = type.toUpperCase() as "OBSTACLE" | "HOTSPOT" | "WALKABLE";

    return (
        <ButtonGroup sx={{ paddingBottom: 1 }}>
            <Button
                variant={clickEffectIsNewZone('circle') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    setClickEffect({
                        type: effectType,
                        shape: 'circle'
                    })
                }}>circle</Button>
            <Button
                variant={clickEffectIsNewZone('rect') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    setClickEffect({
                        type: effectType,
                        shape: 'rect'
                    })
                }}>Rectangle</Button>
            <Button
                variant={clickEffectIsNewZone('polygon') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    setClickEffect({
                        type: effectType,
                        shape: 'polygon'
                    })
                }}>Polygon</Button>
        </ButtonGroup>

    )
}