/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";

import { Conversation, ConversationChoice } from "../../definitions/Conversation"
import styles from './styles.module.css';

interface Props {
    conversation: Conversation;
    select: { (choice: ConversationChoice): void };
}

export function ConversationMenu({ conversation, select, }: Props) {

    const branch = conversation.branches[conversation.currentBranch || conversation.defaultBrach]

    return (
        <nav className={styles.menu}>
            {branch && branch.choices.map((choice, index) => (

                <button onClick={() => { select(choice) }} key={index}>{choice.text}</button>
            ))}
        </nav>
    )
}