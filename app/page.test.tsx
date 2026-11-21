import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Home from '@/app/page';

test('첫 화면에서 가족 열 명 중 본인을 선택하고 암호를 입력할 수 있다', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { level: 1, name: /70년산.*명품엄마/ })).toBeInTheDocument();
  expect(screen.getAllByRole('radio')).toHaveLength(10);
  expect(screen.getByLabelText('가족 암호')).toHaveAttribute('type', 'password');
  expect(screen.getByRole('button', { name: '우리 여행, 함께 만들기' })).toBeDisabled();
});
