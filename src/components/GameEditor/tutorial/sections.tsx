import { TaskList } from "./TaskList";
import { TutorialContainer } from "./TutorialContainer";
import { TutorialContent } from "./TutorialContent";


export const MainWindowTutorial = () => <TutorialContainer defaultExpanded>
    <TutorialContent />
</TutorialContainer>

export const DialogTutorial = () => <TutorialContainer>
    <TaskList onlyDetailNextTask />
</TutorialContainer>