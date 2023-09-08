import { CSSProperties, FunctionComponent, ReactNode, useState, } from "react";
import { Box, Paper, Tabs, Tab, useTheme } from "@mui/material";

export interface TabContents {
    label: string;
    content: ReactNode;
}

interface Props {
    tabs: TabContents[];
    defaultOpenIndex?: number;
    backgroundColor?: string;
    flex?: number;
    noButtons?: boolean;
    contentMinHeight?: number;
}

const tabStyle = (isOpen: boolean, backgroundColor?: string): CSSProperties => {
    return {
        display: isOpen ? 'block' : 'none',
        backgroundColor,
        padding: 5,
    }
}

const Frame = (props: { children: ReactNode }) => {
    const theme = useTheme()
    return <Paper
        sx={{ padding: .5, backgroundColor: theme.palette.grey[100] }}
        elevation={2}>
        {props.children}
    </Paper>
}

export const TabMenu = ({
    tabs,
    defaultOpenIndex = 0,
    backgroundColor,
    contentMinHeight,
}: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)

    return (
        <Box component={Frame}>
            <Tabs value={selectedTabIndex}>
                {tabs.map((tab, index) => (
                    <Tab
                        label={tab.label}
                        key={index}
                        value={index}
                        onClick={(): void => { setSelectedTabIndex(index) }}
                    />
                ))}
            </Tabs>
            <Box sx={{
                paddingX: 1,
                minHeight: contentMinHeight,
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