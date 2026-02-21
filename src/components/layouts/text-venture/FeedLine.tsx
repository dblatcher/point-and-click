import { FeedItem } from "@/lib/text-based/types";
import { Typography } from "@mui/material";
import React, { CSSProperties, ReactNode } from "react";


interface Props {
    feedItem: FeedItem;
}

const List: React.FunctionComponent<{ type: FeedItem['type'], children: ReactNode }> = ({ type, children }) => {
    if (type == 'dialogue') {
        return <ol>{children}</ol>
    }
    return <ul>{children}</ul>
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
                <List type={feedItem.type}>
                    {feedItem.list.map((text, index) => (
                        <Typography
                            key={index}
                            style={{ ...style, lineHeight: 1.1 }}
                            component={'li'}
                        >{text}</Typography>
                    ))}
                </List>
            )}
        </>
    );
};


