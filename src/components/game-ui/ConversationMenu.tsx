
import uiStyles from './uiStyles.module.css';
import { useGameState, useGameStateDerivations } from "@/context/game-state-context";


export function ConversationMenu() {
    const { currentConversation: conversation } = useGameStateDerivations()
    const { dispatchWithProps } = useGameState()

    if (!conversation) { return null }
    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <div className={uiStyles.frame}>
            <nav className={[uiStyles.conversation, uiStyles.contents].join(" ")}>
                {branch && branch.choices.filter(_ => !_.disabled).map((choice, index) => (
                    <button
                        className={[uiStyles.button, uiStyles.conversation].join(" ")}
                        key={index}
                        onClick={() => { dispatchWithProps({ type: 'CONVERSATION-CHOICE', choice }) }}
                    >
                        {choice.text}
                    </button>
                ))}
            </nav>
        </div>
    )
}