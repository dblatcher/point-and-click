import { Conversation } from '@/definitions/Conversation'

const chat: Conversation = {
    id: 'CHAT',
    defaultBranch: 'hello',
    branches: {
        hello: {
            choices: [
                {
                    text: 'hello there, lets talk about tools',
                    ref: 'ASK_ABOUT_TOOLS',
                    nextBranch: 'tools',
                    sequence: "CHAT_HELLO_0",
                },
                {
                    text: 'hello there, lets talk about fish',
                    nextBranch: 'fish',
                    sequence: "CHAT_HELLO_2",
                },
                {
                    text: 'good bye',
                    end: true,
                    sequence: "CHAT_HELLO_1"
                },
            ]
        },
        fish: {
            choices: [
                {
                    text: 'forget about fish. good bye',
                    end: true,
                    sequence: "CHAT_HELLO_1"
                },
            ]
        },
        tools: {
            choices: [
                {
                    text: 'Do you have a hammer?',
                    once: true,
                    enablesChoices: [
                        { choiceRef: 'ASK_FOR_HAMMER' },
                    ],
                    disablesChoices: [
                        { choiceRef: 'ASK_ABOUT_TOOLS', branchId: 'hello' }
                    ],
                    sequence: "CHAT_TOOLS_0"
                },
                {
                    ref: 'ASK_FOR_HAMMER',
                    text: 'Can I have the hammer?',
                    nextBranch: 'hello',
                    disabled: true,
                    once: true,
                    sequence: "CHAT_TOOLS_1"
                },
                {
                    text: 'Do you have a screwdriver?',
                    once: true,
                    sequence: "CHAT_TOOLS_2"
                },
                {
                    text: 'Never mind.',
                    nextBranch: 'hello',
                    sequence: "CHAT_TOOLS_3",
                },
            ]
        }
    }
}

const conversations = [
    chat
]

export { conversations }