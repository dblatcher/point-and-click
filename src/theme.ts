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
        fontFamily: 'arial'
    }
})

export const defaultTheme = createTheme({})

export const editorTheme = createTheme({
    // palette: {
    //     primary: {
    //         main: 'hsl(220deg 100% 50%);',
    //         light: 'hsl(220deg 90% 60%);',
    //         dark: 'hsl(220deg 100% 35%);',
    //         contrastText: '#fff',
    //     },
    //     secondary: {
    //         main: 'hsl(140deg 100% 50%);',
    //         light: 'hsl(140deg 90% 60%);',
    //         dark: 'hsl(140deg 100% 35%);',
    //         contrastText: '#fff',
    //     },
    // },
    palette: defaultTheme.palette,
    typography: {
        fontFamily: 'arial',
        fontSize: 11,
    },
    spacing: 2
})


