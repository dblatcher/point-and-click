type LogEntrySubject = "command" | "order" | 'pathfinding';
export type LogEntry = {
    content: string;
    time: Date;
    subject?: LogEntrySubject
};

export const makeDebugEntry = (content: string, subject?: LogEntrySubject): LogEntry => ({
    content, time: new Date(), subject
})

export type DebugLogger = (message: string, subject?: LogEntry["subject"]) => void
