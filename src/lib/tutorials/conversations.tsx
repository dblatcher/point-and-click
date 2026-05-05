import { ConversationIcon, HelpIcon, PlayCircleOutlineOutlinedIcon } from "@/components/GameEditor/material-icons";
import Link from "next/link";
import { Tutorial, TutorialStage } from "../game-design-logic/types";

const createConversation: TutorialStage = {
    subtitle: 'Conversations',
    intro: <>
        <p>Lets create a <b>Conversation</b>! <ConversationIcon /></p>
        <p>
            Like <b>Actors</b>, <b>Rooms</b> and <b>Inventory Items</b>,
            every <b>Conversation</b> has an "ID" - a unique identifer that
            you use to attach it to events in the game that will start it.
        </p>
    </>,
    tasks: [
        {
            title: 'Add new Conversation',
            detail: `Click the icon on the left menu or press the "7" key. Click "Add new Conversation", then enter an ID.`,
            test(state) {
                return state.gameDesign.conversations.length > 0
            },
        },
        {
            title: 'Put a Conversation Consequence on an Interaction',
            detail: 'Go to the interaction screen and edit the "TALK NPC" interaction. On the Consequences list, insert a "conversation" consequence (NOT "conversationChoice"). Select the ID for you conversation, then save the changes to the interaction',
            test(state) {
                return state.gameDesign.interactions.some(
                    interaction => interaction.targetId === 'NPC' &&
                        interaction.verbId === 'TALK' &&
                        interaction.consequences.some(consequence =>
                            consequence.type === 'conversation' &&
                            !!consequence.conversationId
                        )
                )
            }
        }
    ],
    confirmation: <p>Great! Why not try running the game <PlayCircleOutlineOutlinedIcon /> and talking to the NPC to see the conversation in action? </p>
}

const addChoices: TutorialStage = {
    intro: <>
        <p><b>Conversations</b> are made up of <b>branches</b>, with each <b>branch</b> containing one or more <b>choices</b>. Lets add another <b>choice</b> to your <b>Conversation</b></p>
        <p>When you create a new conversation, the "goodbye" choice is including in the "start" branch by default, but you can customise or remove it.</p>
        <p>It's very important to make sure there is always way to end the conversation, of your players will get stuck! </p>
    </>,
    tasks: [
        {
            title: 'Add a new choice to the "start" branch.',
            detail: 'Go back to the conversation screen with the 7 key, then click your conversation to open it.',
            test(state) {
                return state.gameDesign.conversations.some(
                    conversation =>
                        (conversation.branches?.['start']?.choices ?? [])?.length > 2
                )
            },
        },
        {
            title: 'Make the choice "what is your name?"',
            detail: 'enter "what is your name?" in the text field, then click "create sequence(player says text)"',
            test(state) {
                return state.gameDesign.conversations.some(
                    conversation =>
                        (conversation.branches?.['start']?.choices ?? [])
                            .some(choice =>
                                choice.text.toLowerCase().trim() === 'what is your name?' &&
                                choice.choiceSequence
                            )
                )
            },
        },
    ],
    confirmation: 'nice!'
}

const conclution: TutorialStage = {
    intro: <>
        <p>This is the end of the <b>Conversations</b> tutorial.</p>
        <p>Remeber that the help icon <HelpIcon fontSize="inherit" /> on the converstions page provide some guidance if you need a quick reminder.</p>
    </>,
    tasks: [],
    confirmation: <p>Good luck! <Link href='/editor'>Ready to start building your own game in the Editor?</Link></p>,
}

export const conversationTutorial: Tutorial = {
    title: 'Conversations',
    path: 'conversation',
    designId: 'conversation-tutorial',
    description: <>Bring your story to life with branching <b>Conversations</b>.</>,
    stages: [
        createConversation,
        addChoices,
        conclution,
    ]
}