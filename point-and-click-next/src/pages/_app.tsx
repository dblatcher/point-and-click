import '@/styles/globals.css'
import { redTheme } from '@/theme'
import { ThemeProvider } from '@mui/system'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={redTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
