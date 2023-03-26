import { createTheme } from "@mui/material";

export const redTheme = createTheme({
    palette: {
        primary: {
            main: '#f00',
            light: '#f55',
            dark: '#a00',
            contrastText: '#ffa'
        },
        secondary: {
            main: '#0a0',
            light: '#4a4',
            dark: '#080',
            contrastText: '#faa'
        },
    },
    typography: {
        fontFamily:'cursive'
    }
})
