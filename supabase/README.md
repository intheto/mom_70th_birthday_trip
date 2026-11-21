# 가족 로그인과 방명록 DB

대상 프로젝트: `biwfbbdcgvtbxuaxvzaw`. Supabase CLI 3에서는 원격 대상을 명시한다.

```sh
supabase db push --remote=biwfbbdcgvtbxuaxvzaw --yes
```

앱 실행에는 비공개 `.env.local`의 `SUPABASE_URL`, `SUPABASE_SECRET_KEY`가 필요하다. 키는 서버 전용이며 `NEXT_PUBLIC_` 접두사를 붙이지 않는다. 가족 암호는 앱 실행 환경변수로 비교하지 않고 DB 해시와 비교한다.

가족 정보를 다시 준비할 때만 `FAMILY_MOTHER_PIN`, `FAMILY_SON_PIN`, `FAMILY_DAUGHTER_PIN`을 비공개 환경변수에 네 자리 문자열로 준비하고 실행한다. 실제 값은 Git에 넣지 않는다.

```sh
bun --env-file=.env.local scripts/seed-family-login.ts
```

이 작업은 가족과 구성원을 갱신하며 방명록을 지우지 않는다. 암호 해시·세션·방명록은 RLS가 활성화된 테이블에 저장한다. `anon`·`authenticated`의 직접 접근 권한은 없고 Next.js 서버가 세션을 확인한 다음 접근한다.

## 준비 체크 리스트

공동·가족·개별 완료 상태는 `preparation_shared_checks`, `preparation_family_checks`, `preparation_personal_checks`에 저장한다. 아직 행이 없는 항목은 미완료다. 가족 항목은 가족 ID와 항목 ID의 조합으로 저장하므로 같은 가족의 여러 구성원이 체크해도 집계가 중복되지 않는다.

공동 항목은 김영욱만, 가족 항목은 같은 가족 구성원 누구나, 개별 항목은 본인만 변경한다. 대상 가족·구성원 ID는 클라이언트 입력 대신 서버에서 확인한 로그인 세션으로 결정한다. 공동 의견은 `preparation_comments`에 주제별로 저장한다. 모든 새 테이블은 RLS를 활성화하고 브라우저의 직접 접근을 차단한다.
