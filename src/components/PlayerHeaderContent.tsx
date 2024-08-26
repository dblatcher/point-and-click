import { usePageMeta } from "@/context/page-meta-context"
import { GameDesign } from "@/definitions"
import { Button, Stack, Typography } from "@mui/material"
import React, { useEffect } from "react"

interface Props {
    design?: GameDesign
    eject: { (): void }
}

export const PlayerHeaderContent: React.FunctionComponent<Props> = ({ design, eject }) => {
    const { setHeaderContent } = usePageMeta()
    useEffect(() => {
        if (!design) {
            return setHeaderContent(<></>)
        }
        setHeaderContent(
            <Stack direction={'row'} alignItems={'center'} gap={2}>
                <Typography>{design?.id}</Typography>
                <Button color="secondary" variant="contained" onClick={eject}>exit game</Button>
            </Stack>)
    }, [design, design?.id, setHeaderContent, eject])

    return <></>
}