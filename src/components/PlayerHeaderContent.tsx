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
            return setHeaderContent(null)
        }
        setHeaderContent(
            <Stack direction={'row'} alignItems={'center'} gap={2}>
                {thumbnailUrl && <Avatar src={thumbnailUrl} sx={{backgroundColor:'grey'}} />}
                <Typography>{design?.id}</Typography>
                <Button color="secondary" variant="contained" onClick={eject}>exit game</Button>
            </Stack>)
    }, [design, design?.id, setHeaderContent, eject, thumbnailUrl])

    return <></>
}