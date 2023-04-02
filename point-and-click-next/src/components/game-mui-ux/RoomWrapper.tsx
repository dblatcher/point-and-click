import { RoomWrapperProps } from "../game/uiComponentSet";
import { UiContainer } from "./UiContainer";

export const RoomWrapper = ({ children }: RoomWrapperProps) => {

    return (
        <UiContainer>
            {children}
        </UiContainer>
    )
}
