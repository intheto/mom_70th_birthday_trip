export type NewsKind = 'guestbook' | 'opinion' | 'travel';
export type News = { id: string; kind: NewsKind; author: string; body: string; createdAt: string; topic?: string; title?: string };
export type ReadReceipt = { id: string; kind: NewsKind };
