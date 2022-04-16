type Polygon = [number, number][]

export type { Polygon }

export function polygonToPathD(polygon: Polygon): string {
    let output = ''

    polygon.forEach((point, index) => {
        const [x, y] = point
        const command = index === 0 ? "M" : "L"
        output += `${command} ${x} ${y} `
    })

    output += 'Z'
    return output
}

