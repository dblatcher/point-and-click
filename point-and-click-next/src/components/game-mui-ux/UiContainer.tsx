import { Container } from "@mui/material";
import { ReactNode } from "react";

export const UiContainer = (props: { children: ReactNode }) => (
    <Container maxWidth={'sm'} sx={{ paddingY: .5 }}>
        {props.children}
    </Container>
)