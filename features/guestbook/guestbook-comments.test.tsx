import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { GuestbookComments } from './guestbook-comments';

test('댓글 저장 중 중복 제출을 막고 실패한 입력을 유지한 뒤 재시도할 수 있다', async () => {
  let reject: (error: Error) => void = () => {};
  const action = vi.fn()
    .mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }))
    .mockResolvedValueOnce({ saved: true, error: '' });
  render(<GuestbookComments entryId="post-1" name="김영욱" comments={[]} writeAction={action} />);
  const input = screen.getByLabelText('김영욱 님으로 댓글 남기기');
  fireEvent.change(input, { target: { value: '실패해도 남겨둘 내용' } });
  fireEvent.submit(input.closest('form')!);
  await waitFor(() => expect(screen.getByRole('button', { name: '댓글 저장 중…' })).toBeDisabled());
  expect(input).toBeDisabled();
  reject(new Error('network unavailable'));
  await screen.findByText(/내용은 남아 있으니/);
  expect(input).toHaveValue('실패해도 남겨둘 내용');
  fireEvent.submit(input.closest('form')!);
  await screen.findByText('댓글을 남겼어요.');
  expect(input).toHaveValue('');
  expect(action).toHaveBeenCalledTimes(2);
  expect(action.mock.calls[1][0]).toBe('post-1');
});


test('댓글을 펼치는 조작 없이 작성자와 내용을 바로 읽고 답할 수 있다', () => {
  render(<GuestbookComments entryId="post-2" name="김고은" writeAction={vi.fn()} comments={[
    { id: 'comment-1', author: '이정희', body: '함께 떠나서 좋아요', createdAt: '2026-11-21T01:00:00Z' },
    { id: 'comment-2', author: '김영욱', body: '우리 즐겁게 다녀와요', createdAt: '2026-11-21T02:00:00Z' },
  ]} />);
  expect(screen.getByRole('list', { name: '댓글 목록' })).toBeVisible();
  expect(screen.getByRole('heading', { name: '댓글 2' })).toBeVisible();
  expect(screen.getByText('함께 떠나서 좋아요')).toBeVisible();
  expect(screen.getByText('우리 즐겁게 다녀와요')).toBeVisible();
  expect(screen.queryByRole('button', { expanded: false })).not.toBeInTheDocument();
  expect(screen.getByLabelText('김고은 님으로 댓글 남기기')).toBeVisible();
  expect(screen.getByRole('button', { name: '댓글 남기기' })).toBeDisabled();
});
