import { StoryBoard } from "point-click-lib";
import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { StoryPageDisplay } from "./StoryPageDisplay";
import { GameDataContext } from "point-click-components";
import { SoundAsset } from "@/services/assets";

interface Props {
    storyBoard: StoryBoard
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


const playSoundEffect =
    (getSoundAsset: { (id: string): SoundAsset | undefined }) =>
        async (id: string, volume?: number): Promise<HTMLAudioElement | undefined> => {
            const soundSrc = getSoundAsset(id)?.href;
            if (!soundSrc) {
                return undefined
            }
            const audioElement = document.createElement('audio')
            audioElement.volume = volume ?? 1;
            audioElement.src = soundSrc

            return new Promise((resolve, reject) => {
                audioElement.oncanplay = (() => {
                    audioElement.play()
                    resolve(audioElement)
                });
                audioElement.onerror = reject
            })
        }


export const StoryBoardPlayer: React.FunctionComponent<Props> = ({ storyBoard }) => {
    const { dispatch, getSoundAsset } = useContext(GameDataContext)
    const [pageNumber, setPageNumber] = useState(0)
    const [sound, setSound] = useState<HTMLAudioElement | undefined>(undefined)
    const [wasSoundError, setWasSoundError] = useState(false)

    const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    useEffect(() => {
        setPageNumber(0);
    }, [storyBoard])

    useEffect(() => {
        if (storyBoard.sound && !sound) {
            const play = playSoundEffect(getSoundAsset);
            play(storyBoard.sound.soundId, storyBoard.sound.volume)
                .then((maybeAudioElement) => {
                    if (maybeAudioElement) {
                        const { duration } = maybeAudioElement;
                        if (storyBoard.progression === 'sound') {
                            if (duration && storyBoard.pages.length > 1) {
                                schedulePageTurns(setPageNumber, duration, storyBoard.pages.length)
                            }
                            maybeAudioElement.addEventListener('ended', () => {
                                if (storyBoard.isEndOfGame) {
                                    dispatch({ type: 'RESET' })
                                } else {
                                    dispatch({ type: 'CLEAR-STORYBOARD' })
                                }
                            }, { once: true })

                        }
                        setSound(maybeAudioElement)
                        maybeAudioElement.addEventListener('ended', () => {
                            setSound(undefined)
                        }, { once: true })
                    }
                })
                .catch(err => {
                    console.error('failed to play sound in storyboard', err)
                    setWasSoundError(true)
                })
        }

        return () => {
            sound?.pause()
        }
    }, [storyBoard, dispatch, sound])


    const currentPage = storyBoard.pages[pageNumber]
    const onLastPage = pageNumber === storyBoard.pages.length - 1;
    const onFirstPage = pageNumber === 0;

    const proceed = () => {
        if (onLastPage || (storyBoard.progression === 'sound' && !wasSoundError)) {
            sound?.pause()
            if (storyBoard.isEndOfGame) {
                dispatch({ type: 'RESET' })
            } else {
                dispatch({ type: 'CLEAR-STORYBOARD' })
            }
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