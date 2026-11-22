# 검증

- `bun run typecheck`, `bun run lint`, `bun run test` 통과. 기존 테스트 4개 파일·10개 항목 통과.
- Next.js 16.4.5 `/_next/mcp`에서 프로젝트·라우트 확인. `get_compilation_issues` 및 `get_errors` 오류 없음.
- `agent-browser`와 React DevTools로 `OsakaLandmarks`의 실제 렌더링 확인.
- 랜드마크 다섯 개 → 도시 이름 이야기 → 날씨의 표시 순서 확인.
- 각 카드의 방문 정보 펼치기·접기, 장소에 맞는 Google Maps 링크와 새 창 열기 설정 확인.
- 다섯 사진 모두 정상 로딩 및 Next.js 이미지 최적화 경로 사용 확인. 사진 출처 링크 확인.
- 320px·375px·1280px 화면에서 가로 넘침 없음. 사진 높이 144px 유지, 본문 스크롤 중 하단 메뉴 고정 확인.
- 기존 도시 이름 이야기의 펼치기·접기와 실제 날씨 새로고침 정상 동작 확인.
- 자동 코드 리뷰는 연결 도구 및 `code-review` 실행 파일이 없어 미실행. 프로젝트의 검증·리뷰 예산에 따라 런타임 검증으로 완료.
