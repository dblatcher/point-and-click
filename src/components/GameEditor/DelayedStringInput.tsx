import { useCallback, useEffect, useRef, useState } from "react";
import { StringInput, StringInputProps } from "../SchemaForm/StringInput";
import { useInterval } from "@/hooks/useInterval";


export const DelayedStringInput: React.FunctionComponent<
    StringInputProps & {
        delayAfterEdits?: number
    }
> = ({ inputHandler, value, delayAfterEdits = 2000, ...props }) => {

    const inputRef = useRef<HTMLInputElement>()
    const [localvalue, setLocalValue] = useState(value)
    const [timeOfLastEdit, setTimeOfLastEdit] = useState(Date.now())

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
        setTimeOfLastEdit(Date.now())
    }

    useInterval(() => {
        const timeSinceLastEdit = Date.now() - timeOfLastEdit
        if (timeSinceLastEdit < delayAfterEdits) {
            return
        }
        updatePropValue()
    }, 500)

    return <StringInput
        inputRef={inputRef}
        inputHandler={localInputHandler}
        value={localvalue} {...props} />
}