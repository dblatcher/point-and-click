import { Tutorial } from "../game-design-logic/types";
import { basicTutorial } from "./basic";
import { conversationTutorial } from "./conversations";

export const tutorials = [
    basicTutorial,
    conversationTutorial,
]

export const getTutorialForPath = (tutorialPath: string): Tutorial | undefined => {
    return tutorials.find(tutorial => tutorial.path === tutorialPath)
}
