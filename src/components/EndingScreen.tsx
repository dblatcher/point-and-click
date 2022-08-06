import { FunctionalComponent, h } from "preact";
import { Ending } from "src";
import imageService from "../services/imageService";

interface Props {
    ending: Ending;
    inline?: boolean;
}

const baseArticleStyle = {
    backgroundColor: 'black',
    color: 'red',
    padding: '20px',
    maxWidth: '100%',
}

export const EndingScreen: FunctionalComponent<Props> = ({ ending, inline }) => {

    const imageAsset = ending.imageId ? imageService.get(ending.imageId) : undefined;

    const articleStyle = inline ? {
        ...baseArticleStyle,
        display: 'inline-block',
    } : {
        ...baseArticleStyle,
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%)',
    }


    return (
        <article style={articleStyle}>
            <p>{ending.message}</p>

            {imageAsset && (
                <img src={imageAsset.href} alt={ending.message} width={ending.imageWidth && ending.imageWidth} />
            )}
        </article>
    )
}
