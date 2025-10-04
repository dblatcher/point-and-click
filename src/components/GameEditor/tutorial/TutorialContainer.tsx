import { Tutorial } from "@/lib/game-design-logic/types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import { TutorialContent } from "./TutorialContent";

interface Props {
    tutorial: Tutorial
}


export const TutorialContainer = ({ tutorial }: Props) => {

    const [stageIndex, setStageIndex] = useState(0)
    const progressToNextStage = () => {
        setStageIndex(index => index + 1)
    }

    const currentStage = tutorial.stages[stageIndex];
    const onLastStage = stageIndex + 1 === tutorial.stages.length;

    return <div>
        <Accordion defaultExpanded>
            <AccordionSummary
                id="tutorial-header"
                aria-controls="tutorial-content"
                expandIcon={<ExpandMoreIcon htmlColor="white" />}
                sx={{
                    backgroundColor: 'secondary.dark',
                    color: 'secondary.contrastText'
                }}
            >
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
