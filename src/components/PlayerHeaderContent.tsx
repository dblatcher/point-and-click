import { usePageMeta } from "@/context/page-meta-context";
import { GameDesign } from "@/definitions";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface Props {
    design?: GameDesign;
    thumbnailUrl?: string;
    eject: { (): void };
}

export const PlayerHeaderContent: React.FunctionComponent<Props> = ({ design, eject , thumbnailUrl}) => {
    const { setHeaderContent } = usePageMeta()
    useEffect(() => {
        if (!design) {
            return setHeaderContent(<></>)
        }
        setHeaderContent(
            <Stack direction={'row'} alignItems={'center'} gap={2}>
                <Typography>{design?.id}</Typography>
                {thumbnailUrl && <Avatar src={thumbnailUrl} sx={{marginTop:-1}} />}
                <Button color="secondary" variant="contained" onClick={eject}>exit game</Button>
            </Stack>)
    }, [design, design?.id, setHeaderContent, eject, thumbnailUrl])

    return <></>
}