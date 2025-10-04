import { Typography } from "@mui/material"
import { Tutorial } from "../game-design-logic/types"
import { HelpIcon, InteractionIcon, PlayCircleFilledOutlinedIcon } from "@/components/GameEditor/material-icons"

export const basicTutorial: Tutorial = {
    title: 'Learning the basics',
    designId: 'detailed-template',
    stages: [
        {
            subtitle:'Welcome to Point and Click',
            intro: (<>
                <Typography>
                    To get you started, the game already has already a room with your player character and an NPC, but if you test the game with the Play Button <PlayCircleFilledOutlinedIcon fontSize="inherit"/> and try to talk to them, the game will just give you a default response.
                </Typography>
                <Typography>
                    Our first task will be adding an INTERACTION <InteractionIcon fontSize="inherit"/> so something happens when you talk to the NPC. Not sure what an INTERACTION is? Try clicking the help icon <HelpIcon fontSize="inherit"/> on the Interactions screen.
                </Typography>
            </>),
            tasks: [
                {
                    title: 'Open the "Interactions" screen',
                    detail: 'click the menu on the left or use the 5 key',
                    test(state) {
                        return state.tabOpen === 'interactions'
                    },
                },
                {
                    title: 'Add an INTERACTION for TALK (verb) NPC (target)',
                    detail: 'click "add new interaction", set the verb and target in the dialog and save changes',
                    test(state) {
                        return state.gameDesign.interactions.some(
                            interaction => interaction.targetId === 'NPC' &&
                                interaction.verbId === 'TALK'
                        )
                    },
                },
                {
                    title: 'Give the PLAYER something to say',
                    detail:'open your INTERACTION with the edit button, add an "order" CONSEQUENCE, select "PLAYER" as the ACTOR and create a "say" order. You can then click on the box to edit the text.',
                    test(state) {
                        return state.gameDesign.interactions.some(
                            interaction => interaction.targetId === 'NPC' &&
                                interaction.verbId === 'TALK' &&
                                interaction.consequences.some(consequence => 
                                    consequence.type === 'order' && 
                                    consequence.orders.some(order => order.type === 'say'
                                ))
                        )
                    }
                }
            ],
            confirmation: (<>
                <Typography>Well done - you've created your first INTERACTION.</Typography>
                <Typography>
                    Before going to the next task, try running the game with the play button and talk to the NPC!"
                </Typography>
            </>)
        },
        {
            intro: <Typography>This is the end of the tutorial</Typography>,
            tasks: [],
            confirmation: <Typography>Well done for doing all the tasks.</Typography>,
        }
    ]
}