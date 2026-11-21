-- 기존 서버 세션 인증을 유지하고 의견 본문 갱신만 명시적으로 허용한다.
-- 브라우저의 anon/authenticated 직접 접근 권한과 RLS 설정은 유지한다.
grant update (body) on public.preparation_comments to service_role;
