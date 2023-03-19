import { Button, ButtonTypeMap } from '@mui/material'
import { MouseEventHandler, ReactNode } from 'react'
import { useRouter } from 'next/router'

type Props = ButtonTypeMap['props'] & {
    href: string
    children: ReactNode
}

export const LinkButton = (props: Props) => {
    const router = useRouter()
    const { children, href } = props
    const onClick: MouseEventHandler = (event) => {
        event.preventDefault()
        router.push(href)
    }

    return (
        <Button {...props} onClick={onClick}>{children}</Button>
    )
}
