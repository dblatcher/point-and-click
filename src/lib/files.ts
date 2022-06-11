export function dataToBlob(data: unknown) {

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

export const readJsonFile = async (file?: File): Promise<{ data?: unknown; error?: string }> => {
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

export const fileToImageUrl = (file: File): string | undefined => {
    if (typeof window !== 'undefined') {
        return window.URL.createObjectURL(file)
    }
    return
}
