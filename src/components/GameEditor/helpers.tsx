import { GameDataItemType } from "point-click-lib"

export const formatIdInput = (input: string): string => input.toUpperCase().replaceAll(/[-" "_]+/g, "_")

export const hasPreview = (designProperty: GameDataItemType) => ['rooms', 'actors', 'sprites', 'items', 'stroyboards'].includes(designProperty)

export function truncateLine(text: string, length: number) {
    if (text.length <= length) {
        return text
    }
    return `${text.substring(0, length - 3)}...`;
}