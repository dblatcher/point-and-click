import { z } from "zod"

export function dataToBlob(data: unknown): Blob | null {

    try {
        const dataString = JSON.stringify(data)
        return new Blob([dataString], { type: 'application/json' })
    } catch (error) {
        console.error(error)
        return null
    }
}

export const makeDownloadFile = (fileName: string, blob: Blob): void => {
    if (typeof window !== 'undefined') {
        const { URL, document } = window
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
}


export function downloadJsonFile(data: { id: string }, fileType: string): void {
    const blob = dataToBlob(data)
    if (blob) {
        makeDownloadFile(`${data.id || 'UNNAMED'}.${fileType}.json`, blob)
    }
}

export const uploadFile = async (): Promise<undefined | File> => {
    if (typeof window !== 'undefined') {
        const { document } = window
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('hidden', 'true')
        document.body.appendChild(input);
        input.click()
        document.body.removeChild(input)

        return new Promise(resolve => {
            const callback = (): void => {
                resolve(input.files ? input.files[0] : undefined)
            }

            input.addEventListener('change', callback, { once: true })
        })
    }
    return undefined
}

export const urlToBlob = async (urlString: string, validateAs?: 'image' | 'audio'): Promise<{ blob?: Blob, failure?: undefined } | { blob?: undefined, failure: string }> => {
    try {
        const url = new URL(urlString)
        const response = await fetch(url, { mode: 'cors' })
        if (!response.ok) {
            return { failure: response.statusText }
        }
        const blob = await response.blob()
        switch (validateAs) {
            case 'image':
                if (!blob.type.startsWith('image')) {
                    return { failure: 'not image' }
                }
                break;
            case 'audio':
                if (!blob.type.startsWith('audio') && !blob.type.startsWith('application/ogg')) {
                    return { failure: 'not audio' }
                }
                break;
        }
        return { blob }
    } catch (err) {
        return { failure: err instanceof Error ? err.message : 'unknown error' }
    }
}

const readJsonFile = async (file?: File): Promise<{ data?: unknown; error?: string }> => {
    if (!file) {
        return { error: 'no file!' }
    }

    if (file.type !== 'application/json') {
        return { error: 'not JSON file!' }
    }

    try {
        const contents = await file.text()
        const data = JSON.parse(contents)
        return { data }
    } catch (error) {
        return { error: 'Failed to parse file!' }
    }
}

// TO DO[object url] - think about how we can revoke the object URLs when removing from the services...
export const fileToObjectUrl = (file: File | Blob): string | undefined => {
    if (typeof window !== 'undefined') {
        return window.URL.createObjectURL(file)
    }
    return
}

export async function uploadJsonData<T>(schema: z.ZodType<T>): Promise<{ data?: T; error?: string; errorDetails?: z.ZodError }> {
    const file = await uploadFile();
    const { data, error } = await readJsonFile(file)

    if (error) {
        return { error }
    }

    const result = schema.safeParse(data)
    if (result.success) {
        return { data: result.data }
    }
    return {
        error: result.error.message,
        errorDetails: result.error
    }
}