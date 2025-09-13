import { useEffect } from "react"

type KeyboardCommand = {
    key: string | string[]
    handler: { (event: KeyboardEvent): void }
}

export const useKeyBoard = (commands: KeyboardCommand[]) => {
    return useEffect(() => {
        const handleKeypress = (event: KeyboardEvent) => {
            const { activeElement } = document
            if (activeElement) {
                if (['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
                    return
                }
                if (['Space', 'Enter'].includes(event.key) && activeElement.tagName !== 'BODY') {
                    return
                }
            }
            const handlers = commands.filter(({ key }) => typeof key === 'string' ? key === event.key : key.includes(event.key)).map(command => command.handler)
            handlers.forEach(handler => handler(event))
        }
        window.addEventListener('keypress', handleKeypress)
        return () => {
            window.removeEventListener('keypress', handleKeypress)
        }
    }, [commands])
}