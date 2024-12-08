import { StoryBoard } from "@/definitions/StoryBoard";
import React, { CSSProperties, useEffect, useState } from "react";
import { StoryPageDisplay } from "./StoryPageDisplay";
import { useAssets } from "@/context/asset-context";
import { SoundControl } from "sound-deck";

interface Props {
    storyBoard: StoryBoard
    confirmDone: { (): void }
}

const getDuration = (sourceNode: SoundControl['sourceNode']) => {
    if (sourceNode instanceof HTMLAudioElement) {
        return sourceNode.duration
    }
    if (sourceNode instanceof AudioBufferSourceNode) {
        return sourceNode.buffer?.duration
    }
    return undefined
}

const schedulePageTurns = (setPageNumber: { (pageNumber: number): void }, duration: number, pageCount: number) => {
    const turnsNeeded = pageCount - 1
    const timePerPage = duration / (1 + turnsNeeded);
    for (let page = 1; page <= turnsNeeded; page++) {
        setTimeout(() => {
            setPageNumber(page)
        }, page * timePerPage * 1000)
    }
}

const fullScreenStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
}

const buttonsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 5,
}

export const StoryBoardPlayer: React.FunctionComponent<Props> = ({ storyBoard, confirmDone }) => {
    const [pageNumber, setPageNumber] = useState(0)
    const [sound, setSound] = useState<SoundControl | undefined>(undefined)
    const { soundService } = useAssets()

    const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    useEffect(() => {
        setPageNumber(0);
        if (storyBoard.sound) {
            const soundControl = soundService.play(storyBoard.sound.soundId, {
                volume: storyBoard.sound.volume,
            })
            if (soundControl) {
                const { sourceNode } = soundControl;
                const duration = getDuration(sourceNode)

                if (storyBoard.progression === 'sound') {
                    if (duration) {
                        schedulePageTurns(setPageNumber, duration, storyBoard.pages.length)
                    }
                    soundControl.whenEnded.then(() => {
                        confirmDone()
                    })
                }
                setSound(soundControl)
            }
        }
    }, [setPageNumber, storyBoard, soundService, setSound, confirmDone])

    const currentPage = storyBoard.pages[pageNumber]
    const onLastPage = pageNumber === storyBoard.pages.length - 1;
    const onFirstPage = pageNumber === 0;

    const close = () => {
        sound?.stop()
        confirmDone()
    }

    const proceed = () => {
        if (onLastPage || storyBoard.progression === 'sound') {
            close()
        } else {
            goToNextPage()
        }
    }

    const goBack = () => {
        setPageNumber(Math.max(0, pageNumber - 1))
    }

    if (storyBoard.progression === 'buttons') {
        return <article style={fullScreenStyle}>
            <StoryPageDisplay page={currentPage} />
            <div style={buttonsStyle}>
                <button disabled={onFirstPage} onClick={goBack}>
                    <span>back</span>
                </button>
                <span>{pageNumber + 1} / {storyBoard.pages.length}</span>
                <button onClick={proceed}>
                    <span>{onLastPage ? 'done' : 'next'}</span>
                </button>
            </div>
        </article>
    }

    return <article
        tabIndex={0}
        aria-label="proceed"
        role="button"
        style={{ ...fullScreenStyle, cursor: 'pointer' }}
        onClick={proceed}
    >
        <StoryPageDisplay page={currentPage} font={storyBoard.font} />
    </article>

}