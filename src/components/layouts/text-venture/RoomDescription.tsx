import { Box, Typography } from "@mui/material"
import { FeedLine } from "./FeedLine"
import { makeRoomDescription } from "@/lib/text-based/create-feed-items"
import { useGameStateDerivations } from "../use-derivations"
import { useContext } from "react"
import { GameDataContext } from "point-click-components"


export const RoomDescription = () => {
    const { gameState } = useContext(GameDataContext)
    const { currentRoomId, rooms } = gameState
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
                <FeedLine feedItem={makeRoomDescription(gameState, player)} />
            </>}
        </Box>
    )

}