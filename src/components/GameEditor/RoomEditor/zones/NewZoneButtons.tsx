import { AddIcon, ClickPointActiveIcon, ClickPointIcon } from "@/components/GameEditor/material-icons";
import { Button, ButtonGroup, ButtonGroupProps, useMediaQuery, useTheme } from "@mui/material";
import { FunctionComponent } from "react";
import { ClickEffect, useRoomClickEffect } from "../ClickEffect";
import { SupportedZoneShape } from "@/definitions";


interface Props {
    type: 'obstacle' | 'walkable' | 'hotspot';
    orientation?: ButtonGroupProps['orientation']
}

export const NewZoneButtons: FunctionComponent<Props> = ({
    type,
    orientation
}: Props) => {
    const theme = useTheme();
    const isLgOrUp = useMediaQuery(theme.breakpoints.up('lg'));
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
        <ButtonGroup sx={{ paddingBottom: 1 }} size="small" orientation={orientation ?? isLgOrUp ? 'horizontal' : 'vertical'}>
            {(['circle', 'rect', 'polygon'] as SupportedZoneShape[]).map(
                (shape) => (
                    <Button key={shape}
                        variant={clickEffectIsNewZone(shape) ? 'contained' : 'outlined'}
                        startIcon={clickEffectIsNewZone(shape) ? <ClickPointActiveIcon /> : <ClickPointIcon />}
                        endIcon={<AddIcon />}
                        onClick={() => {
                            setClickEffect(makeEffectForNew(shape))
                        }}>{shape}</Button>
                )
            )}
        </ButtonGroup>

    )
}