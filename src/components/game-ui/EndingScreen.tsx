/* eslint-disable @next/next/no-img-element */
import { useAssets } from "@/context/asset-context";
import { useGameStateDerivations } from "@/context/game-state-context";
import { Ending } from "@/definitions";
import { CSSProperties, FunctionComponent } from "react";


export const EndingWrapper = () => {
    const { ending } = useGameStateDerivations()
    if (!ending) {
        return null
    }

    return <EndingScreen ending={ending} />
}

interface Props {
    ending: Ending;
    inline?: boolean;
}

const baseArticleStyle: CSSProperties = {
    maxWidth: '100%',
}

const baseFrameStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'red',
    padding: '20px',
}

export const EndingScreen: FunctionComponent<Props> = ({ ending, inline }) => {
    const { getImageAsset } = useAssets()
    const articleStyle: CSSProperties = inline ? {
        ...baseArticleStyle,
        display: 'inline-block',
    } : {
        ...baseArticleStyle,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%)',
    }

    const imageAsset = ending.imageId ? getImageAsset(ending.imageId) : undefined;
    const imageStyle = {
        width: typeof ending.imageWidth === 'number' ? ending.imageWidth : undefined
    }

    return (
        <article style={articleStyle}>
            <div style={baseFrameStyle}>
                <p>{ending.message}</p>

                {imageAsset && (
                    <img src={imageAsset.href} alt={ending.message} style={imageStyle} />
                )}
            </div>
        </article>
    )
}
