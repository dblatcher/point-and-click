import { Grid } from "@mui/material";
import { ReactNode } from "react";


export const LayoutHolder = ({ children }: { children: ReactNode }) => <Grid container>{children}</Grid>
export const LayoutControls = ({ children }: { children: ReactNode }) => <Grid item xs={4}>{children}</Grid>
export const LayoutPreview = ({ children }: { children: ReactNode }) => <Grid item xs={8}>
    <div style={{ position: 'sticky', top: 1 }}>
        {children}
    </div>
</Grid>
