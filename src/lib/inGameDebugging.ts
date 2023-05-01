type LogEntrySubject = "command" | "order" | 'pathfinding';
export type LogEntry = {
    content: string;
    time: Date;
    subject?: LogEntrySubject
};

export const makeDebugEntry = (content: string, subject?: LogEntrySubject): LogEntry => ({
    content, time: new Date(), subject
})