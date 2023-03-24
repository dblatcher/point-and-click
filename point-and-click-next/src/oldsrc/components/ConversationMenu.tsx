/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Conversation, ConversationChoice } from "@/oldsrc"
import uiStyles from './uiStyles.module.css';

interface Props {
    conversation: Conversation;
    select: { (choice: ConversationChoice): void };
}

export function ConversationMenu({ conversation, select, }: Props) {

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