import { RoomData } from "src/definitions/RoomData"





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
        document.removeChild(a);
    }

}