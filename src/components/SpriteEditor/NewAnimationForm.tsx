/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { eventToString } from "../../lib/util";
import { TextInput, Warning } from "../formControls";

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
                <TextInput label="animation key" value={animationKey} onInput={event => setAnimationKey(eventToString(event))} />
                <button onClick={handleSubmit} disabled={keyAlreadyUsed || animationKey === ''}>add animation</button>
            </div>
            {warning && (
                <Warning>{warning}</Warning>
            )}
        </div>
    )
}