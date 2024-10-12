import { UiComponentSet } from "../game/uiComponentSet";
import { BigLayout } from "./BigLayout";
import { Layout } from "./Layout";
import { DialogSaveMenu } from "./DialogSaveMenu";

export const materialUiComponents: UiComponentSet = {
    GameLayoutComponent: Layout,
    SaveMenuComponent: DialogSaveMenu,
}

export const bigLayoutSet: UiComponentSet = {
    GameLayoutComponent: BigLayout,
    SaveMenuComponent: DialogSaveMenu,
}