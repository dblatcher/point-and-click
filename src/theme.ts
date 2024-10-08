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
    palette: defaultTheme.palette,
    typography: {
        fontFamily: 'arial',
        fontSize: 11,
        h2: {
            marginTop: 10,
            fontSize: 22,
        },
        h3: {
            marginTop: 10,
            fontSize: 14,
            fontWeight: 700,
        }
    },
    spacing: 2,
    components: {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    position: 'relative',
                    padding: '8px 0 8px',
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    paddingTop: 0,
                    paddingBottom: 1,
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '3px 6px',
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    marginTop: 0,
                    transform: 'translate(4px ,-50%) scale(1)',
                    top: '50%',
                    lineHeight: 1,
                    "& +.MuiInputBase-root": {
                        marginTop: 0,
                    },
                },
                asterisk: {
                    display: 'none',
                },
                shrink: {
                    transform: 'translate(0px ,-140%) scale(.75)',
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                asterisk: {
                    display: 'none',
                },
            }
        },
        MuiIconButton: {
            defaultProps: {
                size: 'small',
            },
            styleOverrides: {
                root: {
                    padding: 2
                }
            },
        },

        MuiCheckbox: {
            defaultProps: {
                size: 'small'
            },
            styleOverrides: {
                root: {
                    padding: 2
                }
            }
        },

        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    minHeight: 28,
                },
                content: {
                    margin: 1,
                }
            }
        },
        MuiList: {
            styleOverrides: {
                dense: {
                    paddingTop: 2,
                    paddingBottom: 2
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                dense: {
                    root: {
                        paddingBottom: 1,
                        paddingTop: 1,
                    }
                },
                root: {
                    paddingBottom: 1,
                    paddingTop: 1,
                },
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    marginTop: 1,
                    marginBottom: 1,
                    paddingLeft: 0,
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 25,
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '2px 4px',
                }
            }
        }
    }
})


