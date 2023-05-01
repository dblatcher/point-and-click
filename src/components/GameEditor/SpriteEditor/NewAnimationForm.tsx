import { FunctionComponent, useState } from "react";
import { icons } from "../dataEditors";
import { Warning, StringInput } from "../formControls";
import editorStyles from '../editorStyles.module.css';
import { Sprite } from "@/lib/Sprite";

interface Props {
    existingKeys: string[];
    submit: { (animationKey: string): void };
}

export const NewAnimationForm: FunctionComponent<Props> = ({ existingKeys, submit }: Props) => {
    const [animationKey, setAnimationKey] = useState<string>('')
    const keyAlreadyUsed = existingKeys.includes(animationKey)
    const warning = keyAlreadyUsed ? `There is already an animation called ${animationKey}` : undefined;
    const handleSubmit = () => {
        if (keyAlreadyUsed || animationKey === '') { return }
        submit(animationKey)
        setAnimationKey('')
    }

    const animationKeySuggestions = Object.values(Sprite.DEFAULT_ANIMATION)
        .filter(value => !existingKeys.includes(value))

    return (
        <div>
            <div>
                <StringInput
                    label="New animation:" value={animationKey}
                    inputHandler={setAnimationKey}
                    suggestions={animationKeySuggestions}
                />

                <button
                    className={[editorStyles.button, editorStyles.plusButton].join(" ")}
                    onClick={handleSubmit} disabled={keyAlreadyUsed || animationKey === ''}>{icons.INSERT}</button>
            </div>
            {warning && (
                <Warning>{warning}</Warning>
            )}
        </div>
    )
}