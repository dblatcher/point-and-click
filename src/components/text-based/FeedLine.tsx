import { FeedItem } from "@/lib/text-based/types";
import { Typography } from "@mui/material";
import { CSSProperties } from "react";


interface Props {
    feedItem: FeedItem;
}

export const FeedLine = ({ feedItem }: Props) => {

    const style: CSSProperties = {
        fontFamily: feedItem.type === 'system' ? 'monospace' : undefined,
        fontWeight: feedItem.type === 'command' ? 'bold' : undefined
    };

    return (
        <>
            <Typography
                style={style}
            >
                {feedItem.type === 'command' && (
                    <b aria-hidden>{'>'}</b>
                )}
                {feedItem.type === 'system' && (
                    <b aria-hidden>{'**'}</b>
                )}
                {feedItem.message}
                {feedItem.type === 'system' && (
                    <b aria-hidden>{'**'}</b>
                )}
            </Typography>
            {feedItem.list && (
                <ul>
                    {feedItem.list.map((text, index) => (
                        <Typography
                            key={index}
                            style={{ ...style, lineHeight: 1.1 }}
                            component={'li'}
                        >{text}</Typography>
                    ))}
                </ul>
            )}
        </>
    );
};


