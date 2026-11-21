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
