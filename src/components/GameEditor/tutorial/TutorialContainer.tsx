import { TutorialContext } from "@/context/tutorial-context";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useContext } from "react";
import { SchoolIcon } from "../material-icons";
import { TutorialContent } from "./TutorialContent";

export const TutorialContainer = () => {
    const {tutorial, stageIndex, setStageIndex} = useContext(TutorialContext)

    if (!tutorial) {
        return null
    }

    const progressToNextStage = () => {
        setStageIndex(index => index + 1)
    }

    const currentStage = tutorial.stages[stageIndex];
    const onLastStage = stageIndex + 1 === tutorial.stages.length;

    return <div>
        <Accordion defaultExpanded disableGutters>
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
                <TutorialContent
                    currentStage={currentStage}
                    onLastStage={onLastStage}
                    progressToNextStage={progressToNextStage}
                />
            </AccordionDetails>
        </Accordion>
    </div>
}
