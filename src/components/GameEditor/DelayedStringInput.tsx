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
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        setLocalValue(value)
        reportLocalChange?.(value)
    }, [value, setLocalValue, reportLocalChange])

    const updatePropValue = useCallback(() => {
        if (localvalue !== value) {
            inputHandler(localvalue)
        }
    }, [localvalue, value, inputHandler])

    useEffect(() => {
        const inputElement = inputRef.current
        inputElement?.addEventListener('blur', updatePropValue)
        return () => {
            inputElement?.removeEventListener('blur', updatePropValue)
        }
    }, [inputRef, updatePropValue])

    const localInputHandler = (newLocalValue: string) => {
        setLocalValue(newLocalValue);
        reportLocalChange?.(newLocalValue);
        if (timerId) {
            clearTimeout(timerId)
        }
        setTimerId(setTimeout(() => inputHandler(newLocalValue), delayAfterEdits))
    }

    return <StringInput
        inputRef={inputRef}
        inputHandler={localInputHandler}
        handleSuggestion={inputHandler}
        value={localvalue} {...props} />
}