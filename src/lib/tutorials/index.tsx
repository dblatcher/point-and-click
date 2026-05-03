import { Tutorial } from "../game-design-logic/types";
import { basicTutorial } from "./basic";

export const tutorials = [
    basicTutorial
]

export const getTutorialForPath = (tutorialPath: string): Tutorial | undefined => {
    return tutorials.find(tutorial => tutorial.path === tutorialPath)
}
