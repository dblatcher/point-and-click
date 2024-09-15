import { ActorData } from "@/definitions"

export const initialActors: ActorData[] = [
    {
        id: 'PLAYER',
        name: 'Seymour Skinner',
        type: 'actor',
        isPlayer: true,
        room: 'OUTSIDE',
        x: (200),
        y: 10,
        width: 40,
        height: 80,
        sprite: 'skinner',
        direction: 'left',
        dialogueColor: 'red',
        soundEffectMap: {
            walk: [
                {
                    soundId: 'footstep-1',
                    frameIndex: 1,
                    volume: .4,
                },
                {
                    soundId: 'footstep-2',
                    frameIndex: 3,
                    volume: .4,
                },
            ],
            run: [
                {
                    soundId: 'footstep-1',
                    frameIndex: 1,
                    volume: .8,
                },
                {
                    soundId: 'footstep-2',
                    frameIndex: 3,
                    volume: .8,
                },
                {
                    soundId: 'footstep-1',
                    frameIndex: 5,
                    volume: .8,
                },
                {
                    soundId: 'footstep-2',
                    frameIndex: 7,
                    volume: .8,
                },
            ]
        }
    },
    {
        id: 'EVIL_SKINNER',
        name: 'Evil Skinner',
        type: 'actor',
        room: 'INSIDE',
        x: (640 * 2 / 5),
        y: 10,
        width: 40,
        height: 80,
        sprite: 'skinner',
        status: 'think',
        direction: 'right',
        filter: 'hue-rotate(45deg)',
        soundEffectMap: {
            think: {
                soundId: 'beep',
                frameIndex: 0,
                volume: .5,
            }
        }
    },
    {
        id: 'MARIO',
        name: 'Mario',
        type: 'actor',
        room: 'OUTSIDE',
        x: (640 * 1 / 5),
        y: 10,
        width: 40,
        height: 80,
        sprite: 'mario',
        direction: 'right',
    },
    {
        id: 'FIRE',
        type: 'actor',
        room: 'OUTSIDE',
        x: 200,
        y: 10,
        height: 50,
        width: 50,
        sprite: 'fire',
        status: 'out',
        soundEffectMap: {
            burning: { soundId: 'fire', volume: .5 },
        }
    },
    {
        id: 'TUBE',
        type: 'actor',
        room: 'OUTSIDE',
        x: 240,
        y: 10,
        height: 30,
        width: 20,
        defaultFrame: {
            imageId:'tube.png'
        }
    },
    {
        id: 'DOLL',
        type: 'actor',
        room: 'OUTSIDE',
        x: 100,
        y: 10,
        height: 40,
        width: 40,
        defaultFrame: {
            imageId:'boy.png'
        },
        statusFrames: {
            'backwards':  {
                imageId:'boy.png',
                row: 1,
            },
        }
    },
]