import { FullScreenLayout } from "../layouts/full-screen-ui/FullScreenLayout";
import { MaterialLayout } from "../layouts/game-mui-ux/Layout";
import { BasicLayout } from "../layouts/basic";
import { TextBasedLayout } from "../layouts/text-venture/TextBasedLayout";
import { FunctionComponent } from "react";

type UiComponentSet = {
    GameLayoutComponent: FunctionComponent;
    title?: string;
    instantMode?: boolean;
}

export type LayoutOption = "fullScreen" | "material" | "textBased" | "simple"

export const layouts: Record<LayoutOption, UiComponentSet> = {
    fullScreen: { GameLayoutComponent: FullScreenLayout, title: "full screen" },
    material: { GameLayoutComponent: MaterialLayout },
    textBased: { GameLayoutComponent: TextBasedLayout, title: "text-venture", instantMode: true },
    simple: { GameLayoutComponent: BasicLayout },
}

export const layoutOptions = Object.keys(layouts) as LayoutOption[]
