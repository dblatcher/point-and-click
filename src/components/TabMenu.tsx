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
    }
}

export const TabMenu: FunctionalComponent<Props> = ({ tabs, defaultOpenIndex = 0 }: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)
    useEffect(() => {
        setSelectedTabIndex(defaultOpenIndex)
    }, [defaultOpenIndex, tabs.length])
    setSelectedTabIndex(clamp(selectedTabIndex, tabs.length - 1))

    return <div>
        <nav>
            {tabs.map((tab, index) =>
                <button key={index} style={buttonStyle(index === selectedTabIndex)}
                    onClick={(): void => { setSelectedTabIndex(index) }}>
                    {tab.label}
                </button>
            )}
        </nav>
        <hr />

        {tabs.map((tab, index) => <div key={index} style={{ display: index === selectedTabIndex ? 'unset' : 'none' }}>
            {tab.content}
        </div>
        )}
    </div>

}