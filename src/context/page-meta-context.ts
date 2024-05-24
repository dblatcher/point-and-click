import { createContext, useContext, ReactNode } from 'react'

const pageMetaContext = createContext<{
    setHeaderContent: { (content: ReactNode): void }
}>(
    {
        setHeaderContent(content) {
            console.warn(`setHeaderContent not defined`, content)
        },
    }
)

export const PageMetaProvider = pageMetaContext.Provider

export const usePageMeta = () => {
    return useContext(pageMetaContext)
}

