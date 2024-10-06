import { GameDataItem } from "@/definitions";
import { cloneData } from "./clone";
import { findById } from "./util";

export const patchMember = <T extends GameDataItem>(id:string, mod:Partial<T>, list:T[]):T[] => {
    const newList = cloneData(list)
    const member = findById(id,newList)
    if (!member) {
        console.warn(`no matching member ${id}`)
        return newList
    }
    Object.assign(member, mod)
    return newList
}

