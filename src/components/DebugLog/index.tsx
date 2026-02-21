import { LogEntry } from "@/lib/inGameDebugging";
import { Box, Typography } from "@mui/material";
import { GameDataContext } from "point-click-components";
import { useContext, useEffect, useState } from "react";
import { EventFeed } from "./EventFeed";
import { FlagList } from "./FlagList";
import { logService } from "../layouts/log-service";



export const DebugLog = () => {
    const { gameState } = useContext(GameDataContext);
    const [log, setLog] = useState<LogEntry[]>([])

    useEffect(() => {
        const handleInGameEvent = (event: LogEntry) => {
            setLog([...log, event])
        }
        logService.emitter.on('debugLog', handleInGameEvent)
        return () => {
            logService.emitter.off('debugLog', handleInGameEvent)
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
