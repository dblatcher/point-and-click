import { FunctionalComponent, h } from "preact";
import { Ending } from "src";

interface Props {
    ending: Ending;
}

export const EndingScreen: FunctionalComponent<Props> = ({ ending }) => {

    return (
        <article style={{
            position:'absolute',
            left:'50%',
            top:'50%',
            backgroundColor: 'black',
            color:'red',
            padding: '20px',
            transform: 'translateX(-50%)'
        }}>
            <p>{ending.message}</p>
        </article>
    )
}
