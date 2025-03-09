import { useGameState } from "@/context/game-state-context";
import { LogEntry } from "@/lib/inGameDebugging";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ActorTable } from "./ActorTable";
import { EventFeed } from "./EventFeed";
import { FlagList } from "./FlagList";

export const DebugLog = () => {
    const { gameState } = useGameState();
    const { emitter } = gameState
    const [log, setLog] = useState<LogEntry[]>([])

    useEffect(() => {
        const logEvents = (newEntry: LogEntry) => {
            setLog([...log, newEntry])
        }
        emitter.on('debugLog', logEvents)
        return () => {
            emitter.off('debugLog', logEvents)
        }
    })

    return (
        <Box component={'aside'} borderBottom={1} marginBottom={2} paddingBottom={2}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
            }} component={'section'}>
                <EventFeed log={log} clearLog={() => setLog([])} />
                <FlagList flagMap={gameState.flagMap} />
            </Box>
            <Box sx={{
                display: 'flex',
                gap: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
            }} component={'section'}>
                <Typography>
                    <b>room:</b>
                    {gameState.currentRoomId}</Typography>
                <Typography>
                    <b>sequence:</b>
                    {gameState.sequenceRunning?.id ?? '[none]'}</Typography>
                <Typography>
                    <b>conversation:</b>
                    {gameState.currentConversationId ?? '[none]'} </Typography>
            </Box>

        </Box >
    );
};
