import { Box, Stack, Typography } from "@mui/material";
import { FunctionComponent, ReactNode } from "react";
import { HelpButton } from "./HelpButton";

interface Props {
    heading: string;
    itemId?: string;
    helpTopic?: string;
    level?: 2 | 3;
    children?: ReactNode;
}


export const EditorHeading: FunctionComponent<Props> = ({
    heading, helpTopic, level = 2, itemId, children
}: Props) => {
    return (
        <Stack component={'header'} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} borderBottom={2} marginBottom={2}>
            <Box>
                <Typography
                    textTransform={'capitalize'}
                    variant={level === 2 ? 'h2' : 'h3'} >
                    {heading}
                </Typography>
                {itemId && <Typography>{itemId}</Typography>}
            </Box>

            <Box alignSelf={'flex-end'} padding={1}>
                {children}
            </Box>

            {helpTopic &&
                <HelpButton helpTopic={helpTopic}
                    fontSize="large"
                    buttonProps={{
                        sx: {
                            marginLeft: 'auto'
                        }
                    }} />
            }
        </Stack>
    )
}