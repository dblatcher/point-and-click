
import { findById } from '@/lib/util';
import { GameDataContext } from 'point-click-components';
import { useContext } from 'react';
import uiStyles from './uiStyles.module.css';


export function ConversationMenu() {
    const {dispatch, gameState} = useContext(GameDataContext)
    const { conversations, currentConversationId } = gameState

    const conversation = findById(currentConversationId, conversations)

    if (!conversation) { return null }
    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <div className={uiStyles.frame}>
            <nav className={[uiStyles.conversation, uiStyles.contents].join(" ")}>
                {branch && branch.choices.filter(_ => !_.disabled).map((choice, index) => (
                    <button
                        className={[uiStyles.button, uiStyles.conversation].join(" ")}
                        key={index}
                        onClick={() => { dispatch({ type: 'CONVERSATION-CHOICE', choice }) }}
                    >
                        {choice.text}
                    </button>
                ))}
            </nav>
        </div>
    )
}