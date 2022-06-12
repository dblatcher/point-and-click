import { FunctionalComponent, h } from "preact";
import { Sprite } from "../../lib/Sprite";
import { Direction, SpriteFrame } from "../../definitions/SpriteSheet";
import { ThingData } from "src/definitions/ThingData";
import { SpritePreview } from "./SpritePreview";



interface Props {
    animKey: string;
    defaultDirection: Direction;
    animation: Partial<Record<Direction, SpriteFrame[]>>;
    overrideSprite: Sprite;
    buildThingData: { (animkey: string, dirKey: Direction): ThingData };
}

export const AnimationControl: FunctionalComponent<Props> = ({
    animKey, animation, defaultDirection, overrideSprite, buildThingData,
}: Props) => {

    return (
        <div key={animKey}>
            <b>{animKey}</b>
            <ul style={{ display: 'flex' }}>
                {(Object.keys(animation) as Direction[]).map(dirKey => (
                    <li key={dirKey}>
                        <em>{dirKey}{dirKey === defaultDirection && '(default)'}</em>
                        <ul>
                            {(animation[dirKey] as SpriteFrame[]).map((frame, index) => (
                                <li key={index}>
                                    <span>{frame.sheetId}</span>
                                    <span>[{frame.col}, {frame.row}]</span>
                                </li>
                            ))}
                        </ul>
                        <SpritePreview
                            overrideSprite={overrideSprite}
                            data={buildThingData(animKey, dirKey)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}