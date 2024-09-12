import { useGameState, useGameStateDerivations } from "@/context/game-state-context"
import { Box, Typography } from "@mui/material"
import { FeedLine } from "./FeedLine"
import { makeRoomDescription } from "@/lib/text-based/create-feed-items"


export const RoomDescription = () => {
    const state = useGameState()
    const { currentRoomId, rooms } = state
    const { player } = useGameStateDerivations()
    const room = rooms.find(room => room.id === currentRoomId)

    return (
        <Box component={'section'}
            aria-live="polite"
            sx={{
                paddingX: 1
            }}
        >
            {room && <>
                <Typography fontWeight={'bold'} textTransform={'uppercase'}>{room.name ?? room.id}</Typography>
                <FeedLine feedItem={makeRoomDescription(state, player)} />
            </>}
        </Box>
    )

}