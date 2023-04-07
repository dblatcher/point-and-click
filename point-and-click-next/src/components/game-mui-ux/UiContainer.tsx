import { Container } from "@mui/material";
import { ReactNode } from "react";

export const UiContainer = (props: { children: ReactNode }) => (
    <Container maxWidth={'md'} sx={{ paddingY: .5 }}>
        {props.children}
    </Container>
)