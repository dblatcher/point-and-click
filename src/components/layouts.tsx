import { materialUiComponents } from "./game-mui-ux";
import { Layout as SimpleLayout } from "./game-ui/Layout";
import { UiComponentSet } from "./game/uiComponentSet";
import { TextBasedLayout } from "./text-based/TextBasedLayout";


export const layouts = {
    material: materialUiComponents,
    textBased: { GameLayoutComponent: TextBasedLayout },
    simple: { GameLayoutComponent: SimpleLayout }
} satisfies Record<string, UiComponentSet>

export type LayoutOption = keyof typeof layouts;
export const layoutOptions = Object.keys(layouts) as LayoutOption[]
