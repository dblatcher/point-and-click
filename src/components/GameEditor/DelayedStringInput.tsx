import { useCallback, useEffect, useRef, useState } from "react";
import { StringInput, StringInputProps } from "../SchemaForm/StringInput";

export const DelayedStringInput: React.FunctionComponent<
    StringInputProps & {
        delayAfterEdits?: number
    }
> = ({ inputHandler, value, delayAfterEdits = 2000, ...props }) => {

    const inputRef = useRef<HTMLInputElement>()
    const [localvalue, setLocalValue] = useState(value)
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined)

    useEffect(() => {
        setLocalValue(value)
    }, [value, setLocalValue])

    const updatePropValue = useCallback(() => {
        if (localvalue !== value) {
            inputHandler(localvalue)
        }
    }, [localvalue, value, inputHandler])

    useEffect(() => {
        inputRef.current?.addEventListener('blur', updatePropValue)
        return () => {
            inputRef.current?.removeEventListener('blur', updatePropValue)
        }
    }, [inputRef.current, updatePropValue])

    const localInputHandler = (newLocalValue: string) => {
        setLocalValue(newLocalValue)
        if (timerId) {
            clearTimeout(timerId)
        }
        setTimerId(setTimeout(() => inputHandler(newLocalValue), delayAfterEdits))
    }

    return <StringInput
        inputRef={inputRef}
        inputHandler={localInputHandler}
        value={localvalue} {...props} />
}