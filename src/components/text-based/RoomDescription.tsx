import { useGameState, useGameStateDerivations } from "@/context/game-state-context"
import { Box, Typography } from "@mui/material"
import { ReactNode } from "react"


const P = ({ children }: { children: ReactNode }) => <Typography lineHeight={1}>{children}</Typography>

export const RoomDescription = () => {

    const { currentRoomId, rooms, actors } = useGameState()
    const { player } = useGameStateDerivations()

    const room = rooms.find(room => room.id === currentRoomId)
    const hotspots = room?.hotspots ?? []
    const actorsInRoom = actors.filter(actor =>
        actor.room === currentRoomId &&
        actor.id !== player?.id
    )

    return (
        <Box component={'section'}
            aria-live="polite"
            sx={{
                paddingX: 1
            }}
        >
            {room && <>
                <P>You {player && `(${player.name})`} are in {room?.id}</P>

                {hotspots.map(
                    hotspot => (
                        <P key={hotspot.id}>
                            There is a {hotspot.name ?? hotspot.id} here.
                        </P>
                    )
                )}

                {actorsInRoom.map(
                    actor => (
                        <P key={actor.id}>
                            {actor.name ?? actor.id} is here.
                            {actor.status && (
                                <>It is {actor.status}.</>
                            )}
                        </P>
                    )
                )}

            </>}
        </Box>
    )

}