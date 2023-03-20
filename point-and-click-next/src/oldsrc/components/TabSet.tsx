import { CSSProperties, FunctionComponent, ReactNode } from "react";

export interface Tab {
    label: string;
    content: ReactNode;
}

interface Props {
    tabs: Tab[];
    openIndex: number;
    backgroundColor?: string;
    flex?: number;
    containerStyle?: CSSProperties;
}

const tabStyle = (isOpen: boolean, backgroundColor?: string): CSSProperties => {
    return {
        display: isOpen ? 'block' : 'none',
        backgroundColor,
        padding: 5,
    }
}

export const TabSet: FunctionComponent<Props> = ({
    tabs,
    openIndex,
    backgroundColor,
    containerStyle,
}: Props) => {


    return <section style={containerStyle}>

        {tabs.map((tab, index) => (
            <div key={index} style={tabStyle(index === openIndex, backgroundColor)}>
                {tab.content}
            </div>
        ))}
    </section>

}