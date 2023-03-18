import { GameDesignSchema, GameDesign } from "@/oldsrc/definitions/Game";
import { FunctionComponent } from "react";

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
            <p>{GameDesignSchema.description}</p>
        </div>
    )
}