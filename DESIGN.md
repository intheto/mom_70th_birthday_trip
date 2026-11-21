# 디자인 안내

화면을 만들거나 검토할 때 이 문서에서 시작한다. 개별 규칙과 근거는 연결된 결정 계약에서 읽는다.

## 값

출처: `app/globals.css`. 해당 소스가 바뀔 때 함께 갱신한다.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(1 0 0)` | `oklch(0.147 0.004 49.25)` |
| `foreground` | `oklch(0.147 0.004 49.25)` | `oklch(0.985 0.001 106.423)` |
| `primary` | `oklch(0.553 0.195 38.402)` | `oklch(0.47 0.157 37.304)` |
| `muted-foreground` | `oklch(0.553 0.013 58.071)` | `oklch(0.709 0.01 56.259)` |
| `border` | `oklch(0.923 0.003 48.717)` | `oklch(1 0 0 / 10%)` |

모서리 기준: `--radius: 0.625rem`. 글꼴 연결 출처: `app/layout.tsx`.

## 공통 구성 요소

출처: `components/ui/`.

- Button
- Card
- Field
- InputGroup, Input, Textarea
- RadioGroup
- Badge
- Alert
- Label, Separator
- Dialog, Empty, Skeleton

## 피하는 패턴

- 일반 UI를 화면별 custom markup과 개별 스타일로 구성 → [UI 구성 원칙](docs/decisions/ui-composition.md)
- 모든 화면에 동일한 고정 페이지 레이아웃 적용 → [UI 구성 원칙](docs/decisions/ui-composition.md)
- 탭별로 다른 브랜드 문구 사용 → [공통 상단 헤더](docs/decisions/app-header.md)

## 화면 요소 연결

- 일반 control, 페이지 shell, 시각 token, 상태 표현 → [UI 구성 원칙](docs/decisions/ui-composition.md)
- 로그인할 구성원 선택과 가족 암호 입력 → [가족 로그인](docs/decisions/family-login.md)
- 로그인 이후 모든 탭의 상단 브랜드와 사용자 이름 영역 → [공통 상단 헤더](docs/decisions/app-header.md)
- 로그인 이후 모든 탭의 하단 메뉴와 본문 스크롤 영역 → [공통 하단 메뉴](docs/decisions/app-navigation.md)
