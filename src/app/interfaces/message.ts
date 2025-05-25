export interface Message {
    senderId: string;
    type: 'text' | 'image' | 'audio' | 'location' | 'file';
    content: string; // texto, URL o geohash
    timestamp: any;
    filename?: string;
    metadata?: {
        name?: string;
        size?: number;
        lat?: number;
        lng?: number;
        mimeType?: string;
    };
}
