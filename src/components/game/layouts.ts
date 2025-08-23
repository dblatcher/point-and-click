import { FullScreenLayout } from "../full-screen-ui/FullScreenLayout";
import { MaterialLayout } from "../game-mui-ux/Layout";
import { SimpleLayout } from "../game-simple-ui/Layout";
import { TextBasedLayout } from "../text-based/TextBasedLayout";
import { UiComponentSet } from "./uiComponentSet";


export const layouts = {
    fullScreen: { GameLayoutComponent: FullScreenLayout },
    material: { GameLayoutComponent: MaterialLayout },
    textBased: { GameLayoutComponent: TextBasedLayout },
    simple: { GameLayoutComponent: SimpleLayout },
} satisfies Record<string, UiComponentSet>

export type LayoutOption = keyof typeof layouts;
export const layoutOptions = Object.keys(layouts) as LayoutOption[]
