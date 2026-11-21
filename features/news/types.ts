export type NewsKind = 'guestbook' | 'opinion';
export type News = { id: string; kind: NewsKind; author: string; body: string; createdAt: string; topic?: string };
export type ReadReceipt = { id: string; kind: NewsKind };
