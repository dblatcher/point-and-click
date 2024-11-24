export function cloneData<T>(data: T): T {
    if (typeof data === 'undefined') { return data }
    const stringified = JSON.stringify(data)
    const clone = JSON.parse(stringified)
    return clone
}

export function cloneArrayWithPatch<T extends Record<string, any>>(array:T[], mod: Partial<T>, index:number):T[] {
    const clone = cloneData(array)
    if (clone[index]) {
        clone[index] = {...clone[index], ...mod}
    }
    return clone
}