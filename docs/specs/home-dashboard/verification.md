# 구현 검증

2026-11-21, Next.js 16.4.5 / Supabase JS 2.119.2 / CLI 3.2.0.

- Supabase changelog와 공식 JS upsert 문서를 새로 조회했다. 기존 서버 전용 DB 접근 방식과 로그인 세션을 유지했다.
- `news_reads`를 연결된 프로젝트에 적용하고 migration history에 적용 기록을 남겼다. RLS를 활성화하고 anon/authenticated 직접 권한을 제거했으며 서버에서만 접근한다.
- `getPreparationProgress`의 기존 집계를 홈에서 사용한다. 항목별 수치 조회를 추가했으며 체크·의견 저장 권한과 저장 함수는 변경하지 않았다.
- 실제 로그인 브라우저에서 기존 방명록 글로 이동하고 읽음이 저장되어 홈에서 빠지는 것을 확인했다.
- 임시 의견을 생성하여 홈에서 준비 의견으로 이동, 해당 주제 자동 펼침, 본문 위치 이동, DB 읽음 저장과 홈 목록 제거를 확인했다. 다른 구성원의 같은 소식 읽음 기록이 생성되지 않은 것을 확인했다. 검증용 의견과 해당 읽음 기록은 삭제했다.
- 실제 준비 완료 수는 공동 0/4, 가족 0/6, 개별 2/20으로 표시됐다. 예시 수치를 하드코딩하지 않았다.
- 390px 화면을 시각적으로 확인하고 360·390·768px에서 가로 넘침 없음과 스크롤 전후 메뉴 위치 유지를 확인했다.
- `/_next/mcp`에서 프로젝트 경로를 확인했으며 `get_compilation_issues`와 `get_errors`가 비어 있었다. agent-browser React tree에서 실제 렌더링을 확인했다.
- lint·typecheck·기존 Vitest 3개가 통과했다. 프로덕션 빌드·별도 E2E 테스트는 수행하지 않았다.
- 자동 코드 리뷰 도구와 code-review CLI가 제공되지 않았다. AGENTS.md의 예산에 따라 재리뷰 없이 완료한다.

공식 확인 자료: https://supabase.com/changelog.md, https://supabase.com/docs/reference/javascript/upsert

## 여행 정보 새 소식 확장 — 2026-11-22

- 기존 커밋 `ab7bcaf`(날씨), `f357f1f`(이름 이야기), `68e2c60`(랜드마크 5곳)을 확인했다.
- 기존 카드 역순, 랜드마크 원본 데이터·사진·펼치기와 날씨 갱신 동작을 유지했다. 카드 발행 정보를 기존 목록과 연결했다.
- 홈의 미확인 여행 정보 7개에서 우메다 카드로 이동하면 카드 본문으로 스크롤되고 읽음이 DB에 저장되는 것을 확인했다. 홈을 다시 열었을 때 6개가 남고 열지 않은 카드는 유지됐다.
- 랜드마크 사진 5장이 유지되고 390px 화면에서 가로 넘침이 없음을 확인했다.
- 테스트 13개·lint·typecheck 통과. 시차가 다른 작성 시각의 실제 시간순 정렬, 종류·구성원별 읽음 구분, 미등록 여행 ID 저장 거부를 회귀 테스트했다.
- Next.js MCP compilation issues와 runtime errors가 비어 있었으며 React tree에서 HomeDashboard·NewsReadTracker를 확인했다.
- 여행 정보 kind 추가 migration을 원격 DB에 적용하고 이력을 기록했다. 기존 읽음 기록과 접근 권한은 유지했다. Supabase security advisor의 error 수준 지적 없음.
- 자동 코드 리뷰 도구가 제공되지 않아 실행하지 못했다. 프로젝트 검증 예산에 따라 재리뷰하지 않았다.
