export type FeedItem = {
    message: string;
    list?: string[];
    type?: 'system' | 'command' | 'dialogue';
};
