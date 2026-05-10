import { DefaultLayout } from "point-click-components";
import { FunctionComponent } from "react";
import { FullScreenLayout } from "../layouts/full-screen-ui/FullScreenLayout";
import { MaterialLayout } from "../layouts/game-mui-ux/Layout";
import { TextBasedLayout } from "../layouts/text-venture/TextBasedLayout";

type UiComponentSet = {
    GameLayoutComponent: FunctionComponent;
    title?: string;
    instantMode?: boolean;
}

export type LayoutOption = "fullScreen" | "material" | "textBased" | "default"

export const layouts: Record<LayoutOption, UiComponentSet> = {
    fullScreen: { GameLayoutComponent: FullScreenLayout, title: "full screen" },
    material: { GameLayoutComponent: MaterialLayout },
    textBased: { GameLayoutComponent: TextBasedLayout, title: "text-venture", instantMode: true },
    default: { GameLayoutComponent: DefaultLayout },
}

export const layoutOptions = Object.keys(layouts) as LayoutOption[]
