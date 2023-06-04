
import { ConversationChoice } from "@/definitions"
import uiStyles from './uiStyles.module.css';
import { useGameStateDerivations } from "../game/game-state-context";

interface Props {
    select: { (choice: ConversationChoice): void };
}

export function ConversationMenu({ select, }: Props) {
    const { currentConversation: conversation } = useGameStateDerivations()

    if (!conversation) { return null }
    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <div className={uiStyles.frame}>
            <nav className={[uiStyles.conversation, uiStyles.contents].join(" ")}>
                {branch && branch.choices.filter(_ => !_.disabled).map((choice, index) => (
                    <button
                        className={[uiStyles.button, uiStyles.conversation].join(" ")}
                        key={index}
                        onClick={() => { select(choice) }}
                    >
                        {choice.text}
                    </button>
                ))}
            </nav>
        </div>
    )
}