import { StateUpdater, useState } from "preact/hooks";


class Position {
    xState: number;
    yState: number;
    setXState: StateUpdater<number>;
    setYState: StateUpdater<number>;
    constructor(xState: number, yState: number, setXState: StateUpdater<number>, setYState: StateUpdater<number>) {
        this.xState = xState
        this.yState = yState
        this.setXState = setXState
        this.setYState = setYState
    }


    get x() {
        return this.xState
    }

    set x(v: number) {

        this.setXState(v)
    }

    get y() {
        return this.yState
    }

    set y(v: number) {
        this.setYState(v)
    }

}

export function usePosition(x: number, y: number) {
    const [xv, sx] = useState(x)
    const [yv, sy] = useState(y)
    return new Position(xv, yv, sx, sy)
}