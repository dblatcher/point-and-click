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
}

const buttonStyle = (isOpen: boolean): JSX.CSSProperties => {
    return {
        color: isOpen ? 'white' : 'black',
        backgroundColor: isOpen ? 'black' : 'white',
        margin: 0,
        cursor: 'pointer',
    }
}

const navStyle = (): JSX.CSSProperties => {
    return {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: 'lightgrey',
        padding: 5,
    }
}

const containerStyle = (isOpen: boolean): JSX.CSSProperties => {
    return {
        display: isOpen ? 'block' : 'none',
        backgroundColor: 'lightgrey',
        padding: 5,
    }
}

export const TabMenu: FunctionalComponent<Props> = ({ tabs, defaultOpenIndex = 0 }: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)
    useEffect(() => {
        setSelectedTabIndex(defaultOpenIndex)
    }, [defaultOpenIndex, tabs.length])
    setSelectedTabIndex(clamp(selectedTabIndex, tabs.length - 1))

    return <div>
        <nav style={navStyle()}>
            {tabs.map((tab, index) =>
                <button key={index} style={buttonStyle(index === selectedTabIndex)}
                    onClick={(): void => { setSelectedTabIndex(index) }}>
                    {tab.label}
                </button>
            )}
        </nav>
        {tabs.map((tab, index) => (
            <div key={index} style={containerStyle(index === selectedTabIndex)}>
                {tab.content}
            </div>
        ))}
    </div>

}