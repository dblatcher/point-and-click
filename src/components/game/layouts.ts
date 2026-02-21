import { FullScreenLayout } from "../full-screen-ui/FullScreenLayout";
import { MaterialLayout } from "../layouts/game-mui-ux/Layout";
import { BasicLayout } from "../layouts/basic";
import { TextBasedLayout } from "../text-based/TextBasedLayout";
import { UiComponentSet } from "./uiComponentSet";


export type LayoutOption = "fullScreen" | "material" | "textBased" | "simple"

export const layouts: Record<LayoutOption, UiComponentSet> = {
    fullScreen: { GameLayoutComponent: FullScreenLayout, title: "full screen" },
    material: { GameLayoutComponent: MaterialLayout },
    textBased: { GameLayoutComponent: TextBasedLayout, title: "text-venture" },
    simple: { GameLayoutComponent: BasicLayout },
}

export const layoutOptions = Object.keys(layouts) as LayoutOption[]
