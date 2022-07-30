/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { Conversation, ConversationChoice } from "src"
import styles from './styles.module.css';

interface Props {
    conversation: Conversation;
    select: { (choice: ConversationChoice): void };
}

export function ConversationMenu({ conversation, select, }: Props) {

    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBranch]

    return (
        <nav className={styles.menu}>
            {branch && branch.choices.filter(_ => !_.disabled).map((choice, index) => (
                <button key={index}
                    onClick={() => { select(choice) }}
                >
                    {choice.text}
                </button>
            ))}
        </nav>
    )
}