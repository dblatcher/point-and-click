import { Conversation } from '../../src/definitions/Conversation'

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
                    text: 'good bye',
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
                        ['ASK_FOR_HAMMER']
                    ],
                    disablesChoices: [
                        ['ASK_ABOUT_TOOLS', 'hello']
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