import { FunctionComponent } from "react";

import type { GameDesign } from "../../../src/definitions/Game"

interface Props {
    gameDesign: GameDesign
}

export const Test: FunctionComponent<Props> = ({ gameDesign }: Props) => {

    return (
        <div>
            <p>
                {gameDesign.id}
            </p>
            <p>
                rooms : {gameDesign.rooms.length}
            </p>
        </div>
    )
}