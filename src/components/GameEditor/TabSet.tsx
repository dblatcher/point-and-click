import { Box } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";

export interface TabSetItem {
    label: string;
    content: ReactNode;
}

interface Props {
    tabs: TabSetItem[];
    openIndex: number;
    onlyRenderOpenTab?: boolean;
}

export const TabSet: FunctionComponent<Props> = ({
    tabs,
    openIndex,
    onlyRenderOpenTab,
}: Props) => {

    if (onlyRenderOpenTab) {
        const openTab = tabs[openIndex]
        if (!openTab) { return null }
        return (
            <Box
                padding={1}
                component={'section'}
            >
                {openTab.content}
            </Box>
        )
    }

    return <>
        {tabs.map((tab, index) => (
            <Box
                key={index}
                padding={1}
                component={'section'}
                display={index === openIndex ? 'block' : 'none'}
            >
                {tab.content}
            </Box>
        ))}
    </>
}