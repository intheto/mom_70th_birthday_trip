# 기존 RLS 자동 활성화 함수의 API 실행 권한 확인

- 증상·근거: 2026-11-21 `supabase db advisors --remote=biwfbbdcgvtbxuaxvzaw --type security --level warn`에서 기존 `public.rls_auto_enable()`의 SECURITY DEFINER 실행 권한이 `anon`·`authenticated`에 열려 있다는 경고 두 개가 나왔다.
- 범위: 이번 가족 로그인·방명록 마이그레이션은 이 함수를 생성하거나 변경하지 않았다. 새 테이블 네 개에는 RLS와 직접 접근 권한 차단을 적용했다.
- 다음 확인: 함수 본문과 실제 호출 주체를 확인하고 불필요한 역할의 EXECUTE 권한을 회수한 뒤 advisors로 확인한다. 기존 이벤트 트리거 동작을 먼저 확인한다.
