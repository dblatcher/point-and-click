/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { GameCondition } from "../../definitions/Game";


interface Props {
    condition: GameCondition;
    log: LogEntry[];
}

export type LogEntry = {
    content: string;
    time: Date;
};

export const makeDebugEntry = (content: string): LogEntry => ({
    content, time: new Date()
})

export const DebugLog: FunctionalComponent<Props> = ({
    condition, log
}: Props) => {


    return (
        <section>
            <hr />
            <h3>Debug log: {condition.id}</h3>
            <p>room:{condition.currentRoomId}</p>
            <p>sequence:{condition.sequenceRunning?.id}</p>
            <ul>
                {log.map((entry, index) => (
                    <li key={index}>
                        {entry.time.toLocaleTimeString()}:
                        <b>{entry.content}</b>
                    </li>
                ))}
            </ul>
        </section>
    );
};
