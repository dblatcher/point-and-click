export type LogEntry = {
    content: string;
    time: Date;
    subject?: string
};

export const makeDebugEntry = (content: string, subject?: string): LogEntry => ({
    content, time: new Date(), subject
})

