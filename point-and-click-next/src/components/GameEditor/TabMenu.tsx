import { CSSProperties, FunctionComponent, useState } from "react";
import { Box, Tabs, Tab as Ttab } from "@mui/material";

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
}

const tabStyle = (isOpen: boolean, backgroundColor?: string): CSSProperties => {
    return {
        display: isOpen ? 'block' : 'none',
        backgroundColor,
        padding: 5,
    }
}

export const TabMenu: FunctionComponent<Props> = ({
    tabs,
    defaultOpenIndex = 0,
    backgroundColor,
}: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)

    return (
        <Box sx={{
            border: '1px solid black',
        }}>

            <Tabs value={selectedTabIndex}>
                {tabs.map((tab, index) => (
                    <Ttab
                        label={tab.label}
                        key={index}
                        value={index}
                        onClick={(): void => { setSelectedTabIndex(index) }}
                    />
                ))}
            </Tabs>
            <Box sx={{
                paddingX: 1
            }}>
                {tabs.map((tab, index) => (
                    <div key={index} style={tabStyle(index === selectedTabIndex, backgroundColor)}>
                        {tab.content}
                    </div>
                ))}
            </Box>
        </Box>
    )

}