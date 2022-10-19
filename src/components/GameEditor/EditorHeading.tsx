import { FunctionalComponent, h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { HelpText } from "./HelpText";

const headerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dashed black',
}

const mainHeaderStyle = {
    ...headerStyle,
    paddingBottom: '.25em',
    borderWidth: 2,
    marginBottom: '.75em',
}

const asideStyle = {
    position: 'absolute',
    background: 'white',
    padding: '1em',
    border: '1px dashed black',
    top: 0,
    right: 0,
    zIndex: 20,
}

interface Props {
    heading: string;
    helpTopic?: string;
}


export const EditorHeading: FunctionalComponent<Props> = ({
    heading, helpTopic
}: Props) => {

    const [helpShowing, setHelpShowing] = useState(false)

    return (
        <header style={mainHeaderStyle}>
            <h2>{heading}</h2>
            {helpTopic && (
                <button onClick={(): void => { setHelpShowing(!helpShowing) }}>?</button>
            )}
            {(helpTopic && helpShowing) && (
                <aside style={asideStyle}>
                    <header style={headerStyle}>
                        <h3>{helpTopic}</h3>
                        <button onClick={(): void => { setHelpShowing(!helpShowing) }}>x</button>
                    </header>
                    <HelpText topic={helpTopic} />
                </aside>
            )}
        </header>
    )

}