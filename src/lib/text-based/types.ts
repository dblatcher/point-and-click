export type FeedItemType = 'system' | 'command' | 'dialogue';

export type FeedItem = {
    message: string;
    list?: string[];
    type?: FeedItemType;
};
