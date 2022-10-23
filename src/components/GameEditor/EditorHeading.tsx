import { FunctionalComponent, h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { HelpText } from "./HelpText";

const headerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dashed black',
}

const h2MainHeaderStyle = {
    ...headerStyle,
    paddingBottom: '.25em',
    borderWidth: 2,
    marginBottom: '.75em',
}

const h3MainHeaderStyle = {
    ...headerStyle,
    paddingBottom: '.125em',
    borderWidth: 1,
    marginBottom: '.5em',
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
    level?: 2 | 3;
}


export const EditorHeading: FunctionalComponent<Props> = ({
    heading, helpTopic, level = 2
}: Props) => {

    const [helpShowing, setHelpShowing] = useState(false)

    return (
        <header style={level === 2 ? h2MainHeaderStyle : h3MainHeaderStyle}>
            {level === 2 && <h2>{heading}</h2>}
            {level === 3 && <h3>{heading}</h3>}
            {helpTopic && (
                <button onClick={(): void => { setHelpShowing(!helpShowing) }}>?</button>
            )}
            {(helpTopic && helpShowing) && (
                <aside style={asideStyle}>
                    <header style={headerStyle}>
                        {level === 2 && <h3>{helpTopic}</h3>}
                        {level === 3 && <h4>{helpTopic}</h4>}
                        <button onClick={(): void => { setHelpShowing(!helpShowing) }}>x</button>
                    </header>
                    <HelpText topic={helpTopic} />
                </aside>
            )}
        </header>
    )

}