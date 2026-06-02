# postech-dining-shortcut

POSTECH 학생식당의 오늘 조식, 점심, 저녁 메뉴를 Apple Shortcuts로 보내기 위한 저장소다.

## 목표

- `POSTECH 오늘 조식`
- `POSTECH 오늘 점심`
- `POSTECH 오늘 저녁`
- `POSTECH 오늘 전체 식사`

각 단축어는 같은 메뉴 API를 사용하고, 대상 식사만 다르게 둔다. 개인 자동화 트리거는 iOS에서 직접 연결한다.

## 데이터 소스

POSTECH dining 페이지의 `weekly-menu.js`가 호출하는 API를 사용한다.

```text
https://food.podac.poapper.com/v1/menus/period/{YYYYMMDD}/{YYYYMMDD}
```

학생식당 타입:

- `BREAKFAST_A`
- `BREAKFAST_B`
- `LUNCH`
- `DINNER`

## 로컬 검증

```bash
npm run menu -- --meal breakfast
npm run menu -- --meal lunch
npm run menu -- --meal dinner
npm run menu -- --meal all
```

특정 날짜:

```bash
npm run menu -- --date 20260602 --meal all
```

## GitHub 관리 방식

- `config/menu.json`: API URL, 출력 라벨, 식사 타입, 포맷 설정
- `scripts/render-menu.mjs`: API 응답과 포맷 검증용 CLI
- `shortcuts/manifest.json`: 배포할 단축어 목록
- `shortcuts/`: 실제 `.shortcut` 파일 보관 위치
- `.github/workflows/verify.yml`: API/포맷 검증
- `.github/workflows/sign-shortcuts.yml`: self-hosted Mac에서 `.shortcut` 서명

## 자동화 배포 제한

단축어 파일은 공유/서명할 수 있지만, 개인 자동화 트리거 자체는 사용자가 각 기기에서 직접 만들어야 한다.

권장 자동화:

- 매일 아침: `POSTECH 오늘 전체 식사`
- 식사 전 알림: `POSTECH 오늘 조식`, `POSTECH 오늘 점심`, `POSTECH 오늘 저녁`

## 서명

GitHub-hosted runner가 아니라, Apple ID와 Shortcuts 환경이 준비된 self-hosted macOS runner에서 서명한다.

```bash
shortcuts sign --mode anyone --input shortcuts/unsigned/example.shortcut --output shortcuts/signed/example.shortcut
```
