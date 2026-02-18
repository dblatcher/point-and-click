import { useAssets } from "@/context/asset-context";
import { useGameState } from "@/context/game-state-context";
import { getStoryboardCloseAction } from "@/lib/game-state-logic/game-state-actions";
import { StoryBoard } from "point-click-lib";
import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { SoundControl } from "sound-deck";
import { StoryPageDisplay } from "./StoryPageDisplay";
import { GameDataContext } from "point-click-components";

interface Props {
    storyBoard: StoryBoard
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


export const StoryBoardPlayer: React.FunctionComponent<Props> = ({ storyBoard }) => {
    const { updateGameState } = useGameState()
    const { dispatch } = useContext(GameDataContext)
    const [pageNumber, setPageNumber] = useState(0)
    const [sound, setSound] = useState<SoundControl | undefined>(undefined)
    const { soundService } = useAssets()

    const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    useEffect(() => {
        setPageNumber(0);
    }, [storyBoard])

    useEffect(() => {
        if (storyBoard.sound && !sound) {
            const soundControl = soundService.play(storyBoard.sound.soundId, {
                volume: storyBoard.sound.volume,
            })
            if (soundControl) {
                const { sourceNode } = soundControl;
                const duration = getDuration(sourceNode)
                if (storyBoard.progression === 'sound') {
                    if (duration && storyBoard.pages.length > 1) {
                        schedulePageTurns(setPageNumber, duration, storyBoard.pages.length)
                    }
                    soundControl.whenEnded.then(() => {
                        updateGameState(getStoryboardCloseAction(storyBoard.isEndOfGame));
                        dispatch({ type: 'CLEAR-STORYBOARD' }) // handle end of game
                    })
                }
                setSound(soundControl)
                soundControl.whenEnded.then(() => setSound(undefined))
            }
        }

        return () => {
            sound?.stop()

        }
    }, [setPageNumber, storyBoard, soundService, setSound, updateGameState, dispatch, sound])


    const currentPage = storyBoard.pages[pageNumber]
    const onLastPage = pageNumber === storyBoard.pages.length - 1;
    const onFirstPage = pageNumber === 0;

    const proceed = () => {
        if (onLastPage || storyBoard.progression === 'sound') {
            sound?.stop()
            updateGameState(getStoryboardCloseAction(storyBoard.isEndOfGame))
            dispatch({ type: 'CLEAR-STORYBOARD' }) // handle end of game
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