import { h, FunctionalComponent, JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { clamp } from "../lib/util";

export interface Tab {
    label: string;
    content: JSX.Element;
}

interface Props {
    tabs: Tab[];
    defaultOpenIndex?: number;
    backgroundColor?: string;
    flex?: number;
    noButtons?: boolean;
    containerStyle?: JSX.CSSProperties;
}

const buttonStyle = (isOpen: boolean): JSX.CSSProperties => {
    return {
        color: isOpen ? 'white' : 'black',
        backgroundColor: isOpen ? 'black' : 'white',
        margin: 0,
        cursor: 'pointer',
    }
}

const navStyle = (backgroundColor?: string): JSX.CSSProperties => {
    return {
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor,
        padding: 5,
    }
}

const tabStyle = (isOpen: boolean, backgroundColor?: string): JSX.CSSProperties => {
    return {
        display: isOpen ? 'block' : 'none',
        backgroundColor,
        padding: 5,
    }
}

export const TabMenu: FunctionalComponent<Props> = ({
    tabs,
    defaultOpenIndex = 0,
    backgroundColor,
    noButtons,
    containerStyle,
}: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)
    useEffect(() => {
        setSelectedTabIndex(defaultOpenIndex)
    }, [defaultOpenIndex, tabs.length])
    setSelectedTabIndex(clamp(selectedTabIndex, tabs.length - 1))

    return <section style={containerStyle}>
        {!noButtons &&
            <nav style={navStyle(backgroundColor)}>
                {tabs.map((tab, index) =>
                    <button key={index} style={buttonStyle(index === selectedTabIndex)}
                        onClick={(): void => { setSelectedTabIndex(index) }}>
                        {tab.label}
                    </button>
                )}
            </nav>
        }
        {tabs.map((tab, index) => (
            <div key={index} style={tabStyle(index === selectedTabIndex, backgroundColor)}>
                {tab.content}
            </div>
        ))}
    </section>

}