import { LogEntry } from "@/lib/inGameDebugging";
import { Box, Button, Typography } from "@mui/material";
import { ScrollingFeed } from "../ScrollingFeed";

interface Props {
    log: LogEntry[]
    clearLog: { (): void }
}

export const EventFeed = ({ log, clearLog }: Props) => {

    return (
        <Box sx={{
            flex: 1,
            borderStyle: 'solid',
            borderWidth: 1,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <ScrollingFeed
                maxHeight={100}
                boxProps={{
                    height: 100,
                    role: 'log',
                    'aria-atomic': true,
                    'aria-live': 'polite',
                    'aria-label': 'in-game events'
                }}
                listProps={{
                    sx: {
                        listStyle: 'none',
                        padding: 1,
                    }
                }}
                feed={log.map((entry, index) => (
                    <Typography key={index}>
                        <b style={{paddingRight:5}}>{entry.time.toLocaleTimeString()}:</b>
                        {entry.content}
                    </Typography>
                ))} />
            <Button onClick={clearLog}>clear log</Button>
        </Box >
    );
};
