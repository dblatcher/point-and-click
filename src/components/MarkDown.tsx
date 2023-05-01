import { useTheme } from "@mui/material";
import { micromark } from "micromark";
import { CSSProperties } from "react";

interface Props {
    content: string;
    style?: CSSProperties;
}

export const MarkDown = ({ content, style = {} }: Props) => {
    const theme = useTheme()

    const __html = micromark(content)

    const combinedStyle: CSSProperties = {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        ...style
    }

    return (
        <div style={combinedStyle} dangerouslySetInnerHTML={{ __html }} />
    )
}