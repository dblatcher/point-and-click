import { TutorialContext } from "@/context/tutorial-context";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { ReactNode, useContext } from "react";
import { SchoolIcon } from "../material-icons";
import { ThemeProvider } from "@mui/material";
import { redTheme } from "@/theme";

export const TutorialContainer = ({ children, defaultExpanded }: { children: ReactNode, defaultExpanded?: boolean }) => {
    const { tutorial, currentStage } = useContext(TutorialContext)

    if (!tutorial || !currentStage) {
        return null
    }

    return <div>
        <ThemeProvider theme={redTheme}>
            <Accordion defaultExpanded={defaultExpanded} disableGutters>
                <AccordionSummary

                    id="tutorial-header"
                    aria-controls="tutorial-content"
                    expandIcon={<ExpandMoreIcon htmlColor="white" />}
                    sx={{
                        backgroundColor: 'secondary.dark',
                        color: 'secondary.contrastText',
                    }}
                >
                    <SchoolIcon sx={{ marginRight: 1 }} />
                    <Typography component="span">Tutorial: {tutorial.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {children}
                </AccordionDetails>
            </Accordion>
        </ThemeProvider>
    </div>
}
