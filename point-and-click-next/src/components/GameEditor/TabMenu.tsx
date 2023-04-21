import { CSSProperties, FunctionComponent, ReactNode, useState, } from "react";
import { Box, Paper, Tabs, Tab as Ttab, useTheme } from "@mui/material";

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

const Frame = (props: { children: ReactNode }) => {
    const theme = useTheme()
    return <Paper
        sx={{ padding: .5, backgroundColor: theme.palette.grey[100] }}
        elevation={2}>
        {props.children}
    </Paper>
}

export const TabMenu: FunctionComponent<Props> = ({
    tabs,
    defaultOpenIndex = 0,
    backgroundColor,
}: Props) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(defaultOpenIndex)

    return (
        <Box component={Frame}>
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