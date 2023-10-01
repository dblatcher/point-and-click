import { FunctionComponent } from "react";
import { ClickEffect } from "./ClickEffect";
import { ButtonGroup, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"

type EntryClickFunction = { (folderId: string, data: { id: string }, isForNew?: boolean): void }
interface Props {
    type: 'obstacle' | 'walkable' | 'hotspot';
    selectZone: EntryClickFunction
    clickEffect?: ClickEffect;
}


export const NewZoneButtons: FunctionComponent<Props> = ({
    type,
    selectZone,
    clickEffect,
}: Props) => {

    const clickEffectIsNewZone = (shapeToCheck: 'circle' | 'rect' | 'polygon'): boolean => {
        if (!clickEffect) { return false }
        if (!('shape' in clickEffect)) { return false }
        return (clickEffect.shape === shapeToCheck && clickEffect.type == type.toUpperCase())
    }

    return (
        <ButtonGroup sx={{ paddingBottom: 1 }}>
            <Button
                variant={clickEffectIsNewZone('circle') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    selectZone(type.toUpperCase(), { id: 'circle' }, true)
                }}>circle</Button>
            <Button
                variant={clickEffectIsNewZone('rect') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    selectZone(type.toUpperCase(), { id: 'rect' }, true)
                }}>Rectangle</Button>
            <Button
                variant={clickEffectIsNewZone('polygon') ? 'contained' : 'outlined'}
                startIcon={<AddIcon />}
                onClick={() => {
                    selectZone(type.toUpperCase(), { id: 'polygon' }, true)
                }}>Polygon</Button>
        </ButtonGroup>

    )
}