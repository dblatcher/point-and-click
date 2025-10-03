import { Typography } from "@mui/material"
import { Tutorial } from "../game-design-logic/types"
import { InteractionIcon, PlayCircleFilledOutlinedIcon } from "@/components/GameEditor/material-icons"

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
                    Our first task will be adding an INTERACTION <InteractionIcon fontSize="inherit"/> so something happens when you talk to the NPC.
                </Typography>
            </>),
            tasks: [
                {
                    title: 'open the interactions menu',
                    detail: 'click the menu on the left or use the 5 key',
                    test(state) {
                        return state.tabOpen === 'interactions'
                    },
                },
                {
                    title: 'add an interaction for TALK (verb) NPC (target)',
                    test(state) {
                        return state.gameDesign.interactions.some(
                            interaction => interaction.targetId === 'NPC' &&
                                interaction.verbId === 'TALK'
                        )
                    },
                },
                {
                    title: 'create a consequence for the interaction - give the PLAYER and ORDER to say something - anything you like!',
                    test(state) {
                        return state.gameDesign.interactions.some(
                            interaction => interaction.targetId === 'NPC' &&
                                interaction.verbId === 'TALK' &&
                                interaction.consequences.some(consequence => consequence.type === 'order' && consequence.orders.some(order => order.type === 'say'))
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
            intro: 'next stage',
            tasks: [],
            confirmation: "That's all",
        }
    ]
}