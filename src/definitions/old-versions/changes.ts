
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
    }
]