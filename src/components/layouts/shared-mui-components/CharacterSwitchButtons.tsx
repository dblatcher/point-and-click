import { Button, ButtonGroup, ButtonGroupProps } from "@mui/material"
import { GameDataContext } from "point-click-components"
import { getActorsPlayerCanSwitchTo } from "point-click-lib"
import { useContext } from "react"

export const CharacterSwitchButtons = ({ buttonGroupProps }: { buttonGroupProps?: ButtonGroupProps }) => {
    const { gameState, dispatch } = useContext(GameDataContext)
    const availablePlayerCharacters = getActorsPlayerCanSwitchTo(gameState, true);
    const canSwitch = availablePlayerCharacters.some(a => !a.isPlayer);

    if (!canSwitch) {
        return null
    }

    return <ButtonGroup {...buttonGroupProps}>
        {availablePlayerCharacters.map((actor, index) => (
            <Button key={index}
                variant={actor.isPlayer ? 'contained' : 'outlined'}
                disabled={actor.isPlayer}
                onClick={() => {
                    dispatch({ type: 'SWITCH-PLAYER', actorId: actor.id })
                }}>{actor.name ?? actor.id}</Button>
        ))}
    </ButtonGroup>
}
