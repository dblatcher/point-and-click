export function cloneData<T>(data: T): T {
    if (typeof data === 'undefined') { return data }
    const stringified = JSON.stringify(data)
    const clone = JSON.parse(stringified)
    return clone
}
