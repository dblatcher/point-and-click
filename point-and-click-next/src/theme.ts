import { createTheme } from "@mui/material";

export const redTheme = createTheme({
    palette: {
        primary: {
            main: '#f00',
            light: '#f55',
            dark: '#a00',
            contrastText: '#fff',
        },
        secondary: {
            main: '#0c0',
            light: '#7c7',
            dark: '#080',
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily:'arial'
    }
})
