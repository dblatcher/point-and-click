import { useCallback, useEffect, useRef, useState } from "react";
import { StringInput, StringInputProps } from "../SchemaForm/StringInput";

export const DelayedStringInput: React.FunctionComponent<
    StringInputProps & {
        delayAfterEdits?: number;
        /** callback to inform the immidiate parent of the local value */
        reportLocalChange?: { (localValue: string): void }
    }
> = ({ inputHandler, reportLocalChange, value, delayAfterEdits = 2000, ...props }) => {

    const inputRef = useRef<HTMLInputElement>()
    const [localvalue, setLocalValue] = useState(value)
    const timerIdRef = useRef<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        setLocalValue(value)
        reportLocalChange?.(value)
    }, [value, setLocalValue, reportLocalChange])

    const updatePropIfDifferent = useCallback((changedValue = localvalue) => {
        if (timerIdRef.current) {
            clearTimeout(timerIdRef.current)
            timerIdRef.current = undefined
        }
        if (changedValue !== value) {
            inputHandler(changedValue)
        }
    }, [localvalue, value, inputHandler])

    const localInputHandler = (newLocalValue: string) => {
        setLocalValue(newLocalValue);
        reportLocalChange?.(newLocalValue);
        if (timerIdRef.current) {
            clearTimeout(timerIdRef.current)
        }
        timerIdRef.current = setTimeout(() => updatePropIfDifferent(newLocalValue), delayAfterEdits)
    }

    return <StringInput
        inputRef={inputRef}
        inputHandler={localInputHandler}
        handleSuggestion={inputHandler}
        onBlur={() => updatePropIfDifferent()}
        value={localvalue} {...props} />
}