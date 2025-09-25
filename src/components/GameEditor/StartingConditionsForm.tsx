import { useGameDesign } from "@/context/game-design-context";
import { listIds } from "@/lib/util";
import { SelectInput } from "../SchemaForm/SelectInput";
import { EditorBox } from "./layout/EditorBox";
import { Box, Button, Tooltip } from "@mui/material";


export const StartingConditionsForm = () => {
    const { gameDesign, applyModification } = useGameDesign();
    const player = gameDesign.actors.find(_ => _.isPlayer)
    const startsInRoomPlayerDoesNotStartIn = !!player && player.room !== gameDesign.currentRoomId

    const setStartingRoomToPlayersLocation = () =>
        applyModification(`Change starting room to ${player?.room}`, { currentRoomId: player?.room })

    const roomButtonTitle = !player
        ? 'No player actor is defined'
        : startsInRoomPlayerDoesNotStartIn
            ? `Change starting room to ${player.room}`
            : undefined

    return (
        <Box minWidth={ 160} display={'flex'} flexDirection={'column'} gap={3} >
            <SelectInput optional label='Starting Room'
                value={gameDesign.currentRoomId}
                inputHandler={currentRoomId => applyModification(`Change starting room to ${currentRoomId}`, { currentRoomId })}
                options={listIds(gameDesign.rooms)} />
            <SelectInput optional label='Opening Seqeunce'
                value={gameDesign.openingSequenceId}
                inputHandler={openingSequenceId => applyModification(`Change opening sequence to ${openingSequenceId}`, { openingSequenceId })}
                options={listIds(gameDesign.sequences)} />
            <SelectInput optional label='Title Board'
                value={gameDesign.openingStoryboardId}
                inputHandler={openingStoryboardId => applyModification(`Change Title board to ${openingStoryboardId}`, { openingStoryboardId })}
                options={listIds(gameDesign.storyBoards)} />
            <Tooltip title={roomButtonTitle}>
                <span>
                    <Button
                        variant="outlined"
                        onClick={setStartingRoomToPlayersLocation}
                        disabled={!startsInRoomPlayerDoesNotStartIn}
                    >
                        Start in player room
                    </Button>
                </span>
            </Tooltip>
        </Box>
    )
}