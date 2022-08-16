import { HotspotZone, Zone } from "../definitions/Zone";
import { RoomData, BackgroundLayer } from "../definitions/RoomData";
import { Ident } from "../definitions/BaseTypes";
import { SpriteData } from "../definitions/SpriteSheet";
import { CharacterData, CharacterDataSchema } from "../definitions/CharacterData";
import { Consequence, consequenceTypes, Interaction } from "../definitions/Interaction";
import { GameDesign } from "../definitions/Game";

interface Property {
    type: 'string' | 'number' | 'object' | 'boolean';
    values?: any[];
    optional?: boolean;
    test?: { (value: unknown): boolean };
}

function testObject<T>(castData: T, description: Record<keyof T, Property>): boolean {
    if (typeof castData !== 'object') { return false }
    const entries = Object.entries(description) as [keyof T, Property][];

    for (let i = 0; i < entries.length; i++) {
        const [key, property] = entries[i]
        const dataValueType = typeof castData[key]
        const failPrefix = `fail: "${key}"(${property.optional ? 'optional' : 'required'})`

        if (!property.optional || (property.optional && dataValueType !== 'undefined')) {
            if (dataValueType !== property.type) {
                console.warn(`${failPrefix} is type ${dataValueType}, should be ${property.type}`)
                return false
            }
            if (property.values && !property.values.includes(castData[key])) {
                console.warn(`${failPrefix} is not one of these valid values: ${property.values.map(_ => _.toString()).join(",")}`)
                return false
            }
        }

        if (dataValueType !== 'undefined' && property.test && !property.test(castData[key])) {
            console.warn(`${failPrefix} failed test ${property.test.name}`)
            return false
        }
    }
    return true
}

function testArray<T>(castData: T[], description: Record<keyof T, Property>): boolean {
    if (typeof castData !== 'object' || !Array.isArray(castData)) { return false }
    for (let i = 0; i < castData.length; i++) {
        if (!testObject(castData[i], description)) {
            return false
        }
    }
    return true;
}

function isNumberPairArray(data: unknown): boolean {
    if (typeof data !== 'object') { return false }
    if (!Array.isArray(data)) { return false }

    for (let i = 0; i < data.length; i++) {
        const datum = data[i]
        if (!isNumberTupple(datum, 2)) {
            return false
        }
    }
    return true
}

function isNumberTupple(datum: unknown, tuppleLength: number): boolean {
    if (!Array.isArray(datum)) {
        return false
    }
    if (datum.length !== tuppleLength) {
        return false
    }
    for (let j = 0; j < datum.length; j++) {
        if (typeof datum[j] !== 'number') {
            return false
        }
    }
    return true
}

function isNumberPair(datum: unknown): boolean {
    return isNumberTupple(datum, 2)
}

function isBackgroundlayerArray(data: unknown): data is BackgroundLayer[] {
    return testArray(data as BackgroundLayer[], backgroundLayerDescription)
}

function isZoneArray(data: unknown): data is Zone {
    return testArray(data as Zone[], zoneDescription)
}

function isHotspotZoneArray(data: unknown): data is HotspotZone {
    return testArray(data as HotspotZone[], HotspotZoneDescription)
}

function isConsequenceArray(data: unknown): data is Consequence[] {
    console.warn('testing union types not supported: consequences may not be valid')
    return testArray(data as Consequence[], consequenceDescription)
}

const identDescription: Record<keyof Ident, Property> = {
    type: { type: 'string' },
    id: { type: 'string' },
    name: { type: 'string', optional: true },
    status: { type: 'string', optional: true },
}

const backgroundLayerDescription: Record<keyof BackgroundLayer, Property> = {
    imageId: { type: 'string' },
    parallax: { type: 'number' },
}

const zoneDescription: Record<keyof Zone, Property> = {
    type: { type: 'string', optional: true },
    x: { type: 'number' },
    y: { type: 'number' },
    path: { type: 'string', optional: true },
    polygon: { type: 'object', optional: true, test: isNumberPairArray },
    circle: { type: 'number', optional: true },
    rect: { type: 'object', optional: true, test: isNumberPair },
}

const HotspotZoneDescription: Record<keyof HotspotZone, Property> = {
    ...identDescription,
    ...zoneDescription,
    type: { type: 'string', values: ['hotspot'] },
    parallax: { type: 'number' },
}

const roomDataDescription: Record<keyof RoomData, Property> = {
    id: { type: 'string' },
    frameWidth: { type: 'number' },
    width: { type: 'number' },
    height: { type: 'number' },
    background: { type: 'object', test: isBackgroundlayerArray },
    hotspots: { type: 'object', optional: true, test: isHotspotZoneArray },
    obstacleAreas: { type: 'object', optional: true, test: isZoneArray },
    walkableAreas: { type: 'object', optional: true, test: isZoneArray },
    scaling: { type: 'object', optional: true, test: isNumberPairArray }
}

const interactionDescription: Record<keyof Interaction, Property> = {
    verbId: { type: 'string' },
    targetId: { type: 'string' },
    roomId: { type: 'string', optional: true },
    itemId: { type: 'string', optional: true },
    targetStatus: { type: 'string', optional: true },
    mustReachFirst: { type: 'boolean', optional: true },
    consequences: { type: 'object', test: isConsequenceArray }
}

const consequenceDescription: Record<keyof Consequence, Property> = {
    type: { type: 'string', values: consequenceTypes }
}

export function isRoomData(data: unknown): data is RoomData {
    return testObject(data as RoomData, roomDataDescription)
}

export function isSpriteData(data: unknown): data is SpriteData {
    console.warn('no test in place')
    return true
}

export function isGameDesign(data: unknown): data is GameDesign {
    console.warn('no test in place')
    return true
}

export function isInteraction(data: unknown): data is Interaction {
    return testObject(data as Interaction, interactionDescription)
}

export function isConsequence(data: unknown): data is Consequence {
    console.warn('testing union types not supported: consequence may not be valid')
    return testObject(data as Consequence, consequenceDescription)
}

