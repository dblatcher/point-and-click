import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface TabContents {
    label: string;
    content: ReactNode;
}

interface Props {
    tabs: TabContents[];
    backgroundColor?: string;
}

export const AccoridanedContent: FunctionComponent<Props> = ({
    tabs,
}: Props) => {

    return (
        <Box>
            {tabs.map((tab, index) => (
                <Accordion key={index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`${tab.label}-content`}>
                        <Typography variant="subtitle1" component={'span'}> {tab.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {tab.content}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    )

}