import { useGameState, useGameStateDerivations } from "@/context/game-state-context"

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
        <article>
            {room && <>
                <p>You {player && `(${player.name})`} are in {room?.id}</p>

                {hotspots.map(
                    hotspot => (
                        <p key={hotspot.id}>
                            There is a {hotspot.name ?? hotspot.id} here.
                        </p>
                    )
                )}

                {actorsInRoom.map(
                    actor => (
                        <p key={actor.id}>
                            {actor.name ?? actor.id} is here.
                            {actor.status && (
                                <>It is {actor.status}.</>
                            )}
                        </p>
                    )
                )}

            </>}
        </article>
    )

}