import { DefaultLayout } from "point-click-components";
import { FunctionComponent } from "react";
import { FullScreenLayout } from "../layouts/full-screen-ui/FullScreenLayout";
import { MaterialLayout } from "../layouts/game-mui-ux/Layout";
import { TextBasedLayout } from "../layouts/text-venture/TextBasedLayout";

type GameDesignPlayerOptions = {
    GameLayoutComponent: FunctionComponent;
    title?: string;
    instantMode?: boolean;
    initialRoomSize?: {
        roomHeight?: number;
        roomWidth?: number;
    }
}

export type LayoutOption = "fullScreen" | "material" | "textBased" | "default"

export const layouts: Record<LayoutOption, GameDesignPlayerOptions> = {
    default: {
        title: 'default layout',
        GameLayoutComponent: DefaultLayout,
        initialRoomSize: {
            roomHeight: 600,
            roomWidth: 600,
        }
    },
    fullScreen: { GameLayoutComponent: FullScreenLayout, title: "full screen" },
    material: { GameLayoutComponent: MaterialLayout },
    textBased: { GameLayoutComponent: TextBasedLayout, title: "text-venture", instantMode: true },
}

export const layoutOptions = Object.keys(layouts) as LayoutOption[]
