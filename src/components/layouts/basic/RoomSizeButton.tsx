import { UiStateContext } from "point-click-components"
import { useContext } from "react"

export const RoomSizeButtons = () => {
    const { dispatchUi, uiState } = useContext(UiStateContext)
    const { roomHeight = 200, roomWidth = 300 } = uiState


    return (<>
        <button onClick={() => dispatchUi({
            type: 'SET_SCREEN_SIZE',
            width: roomWidth + 10,
            height: roomHeight + 10
        })}>+</button>
        <button onClick={() => dispatchUi({
            type: 'SET_SCREEN_SIZE',
            width: roomWidth - 10,
            height: roomHeight - 10
        })}>-</button>
    </>)
}