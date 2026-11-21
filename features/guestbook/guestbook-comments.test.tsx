import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { GuestbookComments } from './guestbook-comments';

test('댓글 저장 중 중복 제출을 막고 실패한 입력을 유지한 뒤 재시도할 수 있다', async () => {
  let reject: (error: Error) => void = () => {};
  const action = vi.fn()
    .mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }))
    .mockResolvedValueOnce({ saved: true, error: '' });
  render(<GuestbookComments entryId="post-1" name="김영욱" comments={[]} writeAction={action} initiallyOpen />);
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
