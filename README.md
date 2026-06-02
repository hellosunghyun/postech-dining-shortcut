# postech-dining-shortcut

POSTECH 학생식당의 오늘 조식, 점심, 저녁 메뉴를 Apple Shortcuts로 보내기 위한 저장소다.

## 목표

- `포스텍 아침`
- `포스텍 점심`
- `포스텍 저녁`
- `포스텍 밥`

각 단축어는 같은 식단 데이터를 사용하고, 대상 식사만 다르게 둔다. 개인 자동화 트리거는 iOS에서 직접 연결한다.

출력에는 메뉴와 함께 칼로리, 프로틴 정보를 표시한다.

## Siri로 사용

단축어를 설치하면 단축어 이름 그대로 Siri에서 실행할 수 있다.

예시:

- “시리야, 포스텍 아침”
- “시리야, 포스텍 점심”
- “시리야, 포스텍 저녁”
- “시리야, 포스텍 밥”

별도 Siri 배포나 등록 파일은 필요 없다. 사용자의 iPhone에 단축어가 추가되어 있고 Siri가 켜져 있으면 사용할 수 있다. 처음 실행할 때 네트워크 접근이나 단축어 실행 확인이 뜰 수 있다.

## 데이터 소스

포스텍 홈페이지에서 식단을 조회해 매일 한국시간 00:00에 캐싱한다.

단축어는 캐시된 식단을 먼저 사용하고, 문제가 있으면 포스텍 홈페이지에서 다시 조회한다.

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

## 단축어 빌드

Cherri로 실제 `.shortcut` 파일을 만든다.

다운로드 페이지:

- [POSTECH Dining Shortcuts](https://hellosunghyun.github.io/postech-dining-shortcut/)

다운로드 페이지의 파란 단축어 이름 링크는 GitHub Pages에 배포된 `.shortcut` 파일을 직접 내려받는다. 사용자는 내려받은 파일을 열어 단축어 앱에 추가한다.

최신 빌드 파일:

- [postech-breakfast.shortcut](https://hellosunghyun.github.io/postech-dining-shortcut/downloads/postech-breakfast.shortcut)
- [postech-lunch.shortcut](https://hellosunghyun.github.io/postech-dining-shortcut/downloads/postech-lunch.shortcut)
- [postech-dinner.shortcut](https://hellosunghyun.github.io/postech-dining-shortcut/downloads/postech-dinner.shortcut)
- [postech-all.shortcut](https://hellosunghyun.github.io/postech-dining-shortcut/downloads/postech-all.shortcut)

```bash
brew tap electrikmilk/cherri
brew install electrikmilk/cherri/cherri
npm run build:shortcuts
```

로컬 명령은 unsigned 파일을 `shortcuts/build/`에 만든다. GitHub Actions는 `macos-latest`에서 signed `.shortcut` artifact를 자동 생성한다.

## GitHub 관리 방식

- `config/menu.json`: API URL, 출력 라벨, 식사 타입, 포맷 설정
- `scripts/render-menu.mjs`: API 응답과 포맷 검증용 CLI
- `shortcuts/manifest.json`: 배포할 단축어 목록
- `shortcuts/src/`: Cherri 단축어 소스
- `shortcuts/build/`: 빌드된 `.shortcut` 파일
- `docs/downloads/`: GitHub Pages에 배포되는 signed `.shortcut` 파일
- `.github/workflows/verify.yml`: API/포맷 검증
- `.github/workflows/cache-menu.yml`: 매일 메뉴 캐시 커밋
- `.github/workflows/sign-shortcuts.yml`: GitHub-hosted macOS에서 `.shortcut` 빌드/서명

## 자동화 배포 제한

단축어 파일은 공유/서명할 수 있지만, 개인 자동화 트리거 자체는 사용자가 각 기기에서 직접 만들어야 한다. 또한 iOS Shortcuts는 사용자 확인 없이 설치된 단축어를 무음 교체할 수 없다.

대신 각 단축어는 실행 시 GitHub Pages의 `version.json`을 확인한다. 새 버전이 있으면 다운로드 페이지를 자동으로 열어 업데이트를 안내한다.

권장 자동화:

- 매일 아침: `포스텍 밥`
- 식사 전 알림: `포스텍 아침`, `포스텍 점심`, `포스텍 저녁`

## 서명

GitHub Actions의 `Build Shortcuts` workflow가 Cherri를 설치하고 `--share=anyone`으로 signed `.shortcut` artifact를 만든다.
