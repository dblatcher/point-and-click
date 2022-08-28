/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { eventToString } from "../../../lib/util";
import { icons } from "../dataEditors";
import { TextInput, Warning } from "../formControls";
import editorStyles from '../editorStyles.module.css';

interface Props {
    existingKeys: string[];
    submit: { (animationKey: string): void };
}

export const NewAnimationForm: FunctionalComponent<Props> = ({ existingKeys, submit }: Props) => {
    const [animationKey, setAnimationKey] = useState<string>('')
    const keyAlreadyUsed = existingKeys.includes(animationKey)
    const warning = keyAlreadyUsed ? `There is already an animation called ${animationKey}` : undefined;
    const handleSubmit = () => {
        if (keyAlreadyUsed || animationKey === '') { return }
        submit(animationKey)
        setAnimationKey('')
    }

    return (
        <div>
            <div>
                <TextInput label="New animation:" value={animationKey} onInput={event => setAnimationKey(eventToString(event))} />
                <button 
                    className={editorStyles.plusButton}
                    onClick={handleSubmit} disabled={keyAlreadyUsed || animationKey === ''}>{icons.INSERT}</button>
            </div>
            {warning && (
                <Warning>{warning}</Warning>
            )}
        </div>
    )
}