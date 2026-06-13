import { SelectInput } from "@/components/SchemaForm/SelectInput"
import { useGameDesign } from "@/context/game-design-context"
import { patchMember } from "@/lib/update-design"
import { findById } from "@/lib/util"
import { Box, Button, Typography } from "@mui/material"
import { XY } from "point-click-components"
import { useState } from "react"
import { ItemPreview } from "../game-item-components/ItemPreview"
import { RoomLocationPicker } from "../RoomLocationPicker"
import { StartingConditionsForm } from "../StartingConditionsForm"

export const StartConditionsAndLocation = () => {
    const { gameDesign, applyModification } = useGameDesign()
    const player = gameDesign.actors.find(actor => actor.isPlayer);
    const [roomId, setRoomId] = useState<string>(gameDesign.currentRoomId)
    const [point, setPoint] = useState<XY | undefined>(player && { x: player.x, y: player.y });

    const playerCharacterOptions = gameDesign.actors.filter(actor => typeof actor.canBePlayer === 'boolean').map(({ id }) => id)
    const activeRoom = findById(roomId, gameDesign.rooms);

    const isInPlaceAlready =
        gameDesign.currentRoomId === roomId &&
        player?.room === roomId
        && player.x === point?.x
        && player.y == point.y;

    const setStartingPosition = () => {
        if (!roomId || !player || !point) {
            return
        }

        applyModification('set start position', {
            currentRoomId: roomId,
            actors: patchMember(player?.id, { ...point, room: roomId }, gameDesign.actors),
        })
    }

    const handleActorChange = (actorId?: string) => {
        const newActor = findById(actorId, gameDesign.actors);
        if (!newActor) {
            return
        }

        let actors = patchMember(newActor.id, { isPlayer: true }, gameDesign.actors);
        if (actorId) {
            actors = patchMember(actorId, { isPlayer: false }, actors)
        }

        applyModification(`set player character to ${newActor.id}`, {
            currentRoomId: newActor.room,
            actors: gameDesign.actors.map(actor => ({
                ...actor,
                isPlayer: actor.id === newActor.id
            })),
        })

        const { room, x, y } = newActor
        setRoomId(room ?? roomId)
        if (typeof x == 'number' && typeof y == 'number') {
            setPoint({ x, y })
        }
    }


    return <Box display={'flex'} gap={2}>
        <Box>
            <SelectInput label="Starting Player Character"
                value={player?.id}
                options={playerCharacterOptions}
                inputHandler={handleActorChange} />
            <StartingConditionsForm />
        </Box>
        <Box display={'flex'} flexDirection={'column'} sx={{ overflowY: 'scroll', height: 430 }}>
            {gameDesign.rooms.map((room, index) => (
                <Button
                    key={index}
                    onClick={() => {
                        setRoomId(room.id)
                        setPoint(undefined)
                    }}
                    variant={room.id === roomId ? 'contained' : 'outlined'}
                    sx={{
                        flexDirection: 'column',
                        minWidth: 150,
                        paddingX: 0,
                    }}
                >
                    <ItemPreview item={room} designProperty="rooms" />
                    <Typography>{room.id}</Typography>
                </Button>
            ))}
        </Box>
        <Box>
            {activeRoom && (
                <RoomLocationPicker
                    targetPoint={point}
                    roomData={activeRoom}
                    previewHeight={200}
                    renderAllZones
                    onClick={setPoint}
                    contents={(player && player?.room === activeRoom.id) ? [
                        { data: player }
                    ] : undefined}
                />
            )}
            {player && (
                <Button disabled={isInPlaceAlready || !player || !point || !roomId}
                    onClick={setStartingPosition}>
                    Game starts with {player.id} here
                </Button>
            )}
        </Box>
    </Box>
}