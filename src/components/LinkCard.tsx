import { Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { MouseEventHandler, ReactNode } from 'react'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';

type Props = {
    href: string
    children: ReactNode
    Icon: typeof PlayCircleOutlineOutlinedIcon
    title: string
}

export const LinkCard = ({ children, href, Icon, title }: Props) => {
    const router = useRouter()
    const onClick: MouseEventHandler = (event) => {
        event.preventDefault()
        router.push(href)
    }

    return (
        <Card onClick={onClick}>
            <CardActionArea>
                <CardHeader
                    title={<Typography color={'primary.contrastText'} variant="h3">{title}</Typography>}
                    avatar={<Icon htmlColor="white" fontSize={'large'} />}
                    sx={{ backgroundColor: 'primary.main' }}
                />
                <CardContent sx={{ minHeight: 80 }}>
                    {children}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
