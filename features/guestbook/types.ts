export type GuestbookComment = { id: string; body: string; createdAt: string; author: string };
export type GuestbookEntry = { id: string; body: string; createdAt: string; author: string; comments: GuestbookComment[] };
export type GuestbookState = { error: string; saved: boolean };
export type WriteCommentAction = (entryId: string, state: GuestbookState, form: FormData) => Promise<GuestbookState>;
