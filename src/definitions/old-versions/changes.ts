
export type VersionChange = {
    schemaVersion: number
    changes: {
        breaking: boolean
        description: string
    }[]
}

export const changeHistory: VersionChange[] = [
    {
        schemaVersion: 3,
        changes: [
            {
                breaking: false,
                description: "Designs have schemaVersion property"
            },
            {
                breaking: false,
                description: "storyBoards array is required"
            }
        ]
    },
    {
        schemaVersion: 4,
        changes: [
            {
                breaking: true,
                description: "Endings deprecated in favour of storyBoards. Any Endings have been converted to Storyboards."
            },
            {
                breaking: false,
                description: "StoryBoards have ending option."
            }
        ]
    }
]