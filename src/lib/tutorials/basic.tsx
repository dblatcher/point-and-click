import { Tutorial, TutorialStage } from "../game-design-logic/types"
import { HelpIcon, InteractionIcon, PlayCircleFilledOutlinedIcon } from "@/components/GameEditor/material-icons"
import { findById } from "../util";

const addInteraction: TutorialStage = {
    subtitle: 'Welcome to Point and Click',
    intro: (<>
        <p>
            To get you started, the game already has already a room with your player character and an NPC, but if you test the game with the Play Button <PlayCircleFilledOutlinedIcon fontSize="inherit" /> and try to talk to them, the game will just give you a default response.
        </p>
        <p>
            Our first task will be adding an INTERACTION <InteractionIcon fontSize="inherit" /> so something happens when you talk to the NPC. Not sure what an INTERACTION is? Try clicking the help icon <HelpIcon fontSize="inherit" /> on the Interactions screen.
        </p>
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
            detail: 'open your INTERACTION with the edit button, add an "order" CONSEQUENCE, select "PLAYER" as the ACTOR and create a "say" order. You can then click on the box to edit the text.',
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
        <p>Well done - you've created your first INTERACTION.</p>
        <p>Before going to the next task, try running the game with the play button and talk to the NPC!</p>
    </>)
};

const createActor: TutorialStage = {
    intro: <>
        <p>
            Let's add a new object in the game world. Anything that can be placed in a room in the game world - people, robots, inanimate objects etc - are described as ACTORS.
        </p>
        <p>
            ACTORS can use SPRITEs to be fully animated, but for now, let's make a simple ACTOR represented with a static image of a white tube.
        </p>
        <p>ACTORS, and most things you add to the game need a unique "id" to identify them in the engine. Let's give our new ACTOR the id "TUBE".</p>
    </>,
    tasks: [
        {
            title: 'open the "Actors" screen',
            detail: 'click the menu or press "3"',
            test(state) {
                return state.tabOpen === 'actors'
            },
        },
        {
            title: 'add a new ACTOR and start it in room-1',
            detail: 'Click the "Add" button and enter "TUBE" as the id. Select "room-1" from the "starting room drop-down"',
            test(state) {
                const newActor = findById('TUBE', state.gameDesign.actors);
                return newActor?.room === 'room-1'
            },
        },
        {
            title: 'pick a spot in the room to place your new ACTOR',
            detail: 'click a point on the preview of the room',
            test(state) {
                const newActor = findById('TUBE', state.gameDesign.actors)
                return newActor?.room === 'room-1' &&
                    newActor.x !== 0 &&
                    newActor.y !== 0
            },
        },
        {
            title: 'set the image to represent your ACTOR',
            detail: 'go to the "images" tab of the Actor Editor and click "pick default frame" and choose the image from the "tube.png" sprite sheet',
            test(state) {
                const newActor = findById('TUBE', state.gameDesign.actors)
                return !!newActor?.defaultFrame
            },
        }
    ],
    confirmation: <>
        <p>Great, your new ACTOR is now in the room!</p>
        <p>There are no INTERACTIONs associated with the tube yet, so there's not much your player can do with it.</p>
    </>
};

const inventory: TutorialStage = {
    intro: <>
        <p>What if our player character wanted to pick up the tube and carry it around?</p>
        <p>We can create INVENTORY ITEMS to represent things that the player can carry and use in INTERACTIONS. Let's create onr for the tube.</p>
        <p>We will also need to add an INTERACTION to allow the player to pick up the ACTOR represening the TUBE</p>
    </>,
    tasks: [
        {
            title: 'Add a new inventory item with the ID "TUBE_ITEM"',
            test(state) {
                const tubeItem = findById('TUBE_ITEM', state.gameDesign.items);
                return !!tubeItem;
            },
        },
        {
            title: 'Pick an icon for the INVENTORY ITEM - you can use the same image we used for the tube ACTOR',
            test(state) {
                const tubeItem = findById('TUBE_ITEM', state.gameDesign.items);
                return !!tubeItem?.imageId;
            },
        },
        {
            title: 'Create an INTERACTION with the TUBE actor as the target and "TAKE" as the verb.',
            detail: 'You can create INTERACTIONS from the ACTOR screen, or from the main Interactions screen',
            test(state) {
                return state.gameDesign.interactions.some(interaction => interaction.targetId === 'TUBE' && interaction.verbId === 'TAKE')
            },
        },
        {
            title: "Add consequences to the INTERACTION - it should remove the ACTOR and add the INVENTORY ITEM to the player's inventory",
            detail: "You need a 'remove actor' consequence and an 'inventory' consequence",
            test(state) {
                return state.gameDesign.interactions.some(interaction =>
                    interaction.targetId === 'TUBE' && interaction.verbId === 'TAKE' &&
                    interaction.consequences.some(consequence => consequence.type === 'removeActor' && consequence.actorId === 'TUBE') &&
                    interaction.consequences.some(consequence => consequence.type === 'inventory' && consequence.addOrRemove === 'ADD' && consequence.itemId === 'TUBE_ITEM')
                )
            },
        }
    ],
    confirmation: <>
        <p>Great! try running the game again and pick up the tube!</p>
        <p>You should see the item in the player's inventory.</p>
    </>
}

const mustReachAndName: TutorialStage = {
    intro: <>
        <p>
            If you ran the game and picked up the tube, you probably noticed that the player character didn't move and the consequences happened immediately.
            Sometimes, that's what you want, but wouldn't it be better for the player character to have to get close enough to pick up the tube?
        </p>
        <p>There's an option for that - under the Conditions for an INTERACTION, you can set "Must reach target first" to on/checked.</p>
        <p>
            Did you also notice that "TUBE", the ACTOR's id appears in the command bar in the game ui?
            You can customise the text used in-game to refer to ACTORs and INVENTORY_ITEMS by giving them a 'name'.
        </p>
    </>,
    tasks: [
        {
            title: 'Open the "PICK UP TUBE" INTERACTION and set "Must reach target first" to on',
            test(state) {
                return state.gameDesign.interactions.some(interaction =>
                    interaction.targetId === 'TUBE' && interaction.verbId === 'TAKE' &&
                    interaction.consequences.some(consequence => consequence.type === 'removeActor' && consequence.actorId === 'TUBE') &&
                    interaction.consequences.some(consequence => consequence.type === 'inventory' && consequence.addOrRemove === 'ADD' && consequence.itemId === 'TUBE_ITEM') &&
                    interaction.mustReachFirst === true
                )
            },
        },
        {
            title: 'Set a name for the "TUBE" ACTOR',
            detail: 'This can be anything you like, but pick something that will describe it for the player.',
            test(state) {
                return !!findById('TUBE', state.gameDesign.actors)?.name
            },
        }
    ],
    confirmation: <>
        <p>Try running the game again and pick up the tube - the consequences won't happen until the player character reaches the target.</p>
        <p>If the player character cannot reach the target, the INTERACTION will fail and the player character will say the default response.</p>
    </>
}

const interactionUsingItem: TutorialStage = {
    intro: <>
        <p>Now the player can pick up the tube - let's give them something to do with it!</p>
        <p>INTERACTIONS need a verb and a target, but they can also have an INVENTORY_ITEM if the verb supports it. In this game, the "USE" and "GIVE" verbs support INVENTORY ITEMS</p>
        <p>To try that out, let's make something happen when we give the tube to the NPC.</p>
    </>,
    tasks: [
        {
            title: 'create an INTERACTION for GIVE TUBE_ITEM TO NPC',
            test(state) {
                return state.gameDesign.interactions.some(interaction =>
                    interaction.verbId === 'GIVE' &&
                    interaction.targetId === 'NPC' &&
                    interaction.itemId === 'TUBE_ITEM'
                )
            },
        },
        {
            title: "add a consequence to remove the item from the player's inventory",
            test(state) {
                return state.gameDesign.interactions.some(interaction =>
                    interaction.verbId === 'GIVE' &&
                    interaction.targetId === 'NPC' &&
                    interaction.itemId === 'TUBE_ITEM' &&
                    interaction.consequences.some(consequence =>
                        consequence.type === 'inventory' &&
                        consequence.itemId === 'TUBE_ITEM' &&
                        consequence.addOrRemove === 'REMOVE'
                    )
                )
            }
        },
        {
            title: "add a consequence to the INTERACTION give an order to the NPC to say something (anything you like!)",
            test(state) {
                return state.gameDesign.interactions.some(interaction =>
                    interaction.verbId === 'GIVE' &&
                    interaction.targetId === 'NPC' &&
                    interaction.itemId === 'TUBE_ITEM' &&
                    interaction.consequences.some(consequence =>
                        consequence.type === 'order' &&
                        consequence.actorId === 'NPC' &&
                        consequence.orders.some(order => order.type === 'say')
                    )
                )
            }
        },
    ],
    confirmation: <>
        <p>That's it - run the game and give it a go!</p>
    </>
}

const conclution: TutorialStage = {
    intro: <>
        <p>This is the end of the tutorial. I hope it helped you get an understanding of ACTORS, INVENTORY_ITEMS and INTERACTIONS.</p>
        <p>There are more features to discover. Every screen in the editor has a help icon <HelpIcon fontSize="inherit" /> to explain what they are for.</p>
    </>,
    tasks: [],
    confirmation: <p>Good luck! <a href='/editor'>Ready to start building your own game in the Editor?</a></p>,
}

export const basicTutorial: Tutorial = {
    title: 'Learning the basics',
    designId: 'detailed-template',
    stages: [
        addInteraction,
        createActor,
        inventory,
        mustReachAndName,
        interactionUsingItem,
        conclution,
    ]
}