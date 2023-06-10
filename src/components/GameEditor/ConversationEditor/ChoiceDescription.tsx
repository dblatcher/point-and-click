import { ConversationChoice } from "@/definitions";

function truncateLine(text: string, length: number) {
    if (text.length <= length) {
        return text
    }
    return `${text.substring(0, length - 3)}...`;
}

interface Props {
    choice: ConversationChoice
    openEditor: { (): void }
}

export const ChoiceDescription = ({ choice, openEditor }: Props) => {

    return <div>
        <button
            onClick={openEditor}
            style={{
                textAlign: 'left',
                minWidth: '12em',
                padding: 2,
            }}>
            {choice.text ? truncateLine(choice.text, 25) : "[no text]"}
        </button>
    </div>
}