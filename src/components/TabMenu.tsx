import { h, FunctionalComponent, ComponentChildren, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { clamp } from "../../src/lib/util";

interface Tab {
    label: string;
    content: JSX.Element;
}

interface Props {
    tabs: Tab[];
    defaultOpenIndex?: number;
    backgroundColor?: string;
}

const buttonStyle = (isOpen: boolean): JSX.CSSProperties => {
    return {
        color: isOpen ? 'white' : 'black',
        backgroundColor: isOpen ? 'black' : 'white',
        margin: 0,
        cursor: 'pointer',
    }
}

const navStyle = (backgroundColor: string): JSX.CSSProperties => {
    return {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor,
        padding: 5,
    }
}

const containerStyle = (isOpen: boolean, backgroundColor: string): JSX.CSSProperties => {
    return {
        display: isOpen ? 'block' : 'none',
        backgroundColor,
        padding: 5,
    }
}

export const TabMenu: FunctionalComponent<Props> = ({
    tabs,
    defaultOpenIndex = 0,
    backgroundColor = 'lightgrey'
}: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)
    useEffect(() => {
        setSelectedTabIndex(defaultOpenIndex)
    }, [defaultOpenIndex, tabs.length])
    setSelectedTabIndex(clamp(selectedTabIndex, tabs.length - 1))

    return <div>
        <nav style={navStyle(backgroundColor)}>
            {tabs.map((tab, index) =>
                <button key={index} style={buttonStyle(index === selectedTabIndex)}
                    onClick={(): void => { setSelectedTabIndex(index) }}>
                    {tab.label}
                </button>
            )}
        </nav>
        {tabs.map((tab, index) => (
            <div key={index} style={containerStyle(index === selectedTabIndex, backgroundColor)}>
                {tab.content}
            </div>
        ))}
    </div>

}