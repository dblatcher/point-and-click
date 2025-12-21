import { Sequence } from "point-click-lib";

export const intro: Sequence = {
    id: "intro",
    stages: [{
        narrative: { text: ['This is the intro sequence', 'Welcome to the game.'] },
        immediateConsequences: [
            { type: 'flag', flag: 'TEST_FLAG_3', on: true },
        ]
    }],
}
