import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { FamilyLogin } from '@/features/family-login';

const families = [
  { label: '사랑하는 우리 어머니', members: ['이정희'] },
  { label: '아들래미 가족', members: ['김영욱', '류낭', '김재이', '김태이', '김채이'] },
  { label: '딸래미 가족', members: ['김고은', '강병용', '강한성', '강한결'] },
];

test('첫 화면에서 가족 열 명 중 본인을 선택하고 암호를 입력할 수 있다', () => {
  render(<FamilyLogin families={families} loginAction={async () => ({ error: '' })} />);
  expect(screen.getByRole('heading', { level: 1, name: /70년산.*명품엄마/ })).toBeInTheDocument();
  expect(screen.getAllByRole('radio')).toHaveLength(10);
  expect(screen.getByLabelText('가족 암호')).toHaveAttribute('type', 'password');
  expect(screen.getByRole('button', { name: '엄마! 잘탈게! ✈️' })).toBeDisabled();
});
