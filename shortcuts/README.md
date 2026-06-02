# Shortcuts

이 디렉터리는 배포할 Apple Shortcuts 파일을 보관한다.

## 만들 단축어

- `포스텍 아침`
- `포스텍 점심`
- `포스텍 저녁`
- `포스텍 밥`

각 단축어는 같은 캐시 데이터와 포맷 설정을 쓰고, `meal` 값만 다르게 둔다.

출력에는 메뉴와 함께 칼로리, 프로틴 정보를 표시한다.

## Siri 사용

설치된 단축어는 이름 그대로 Siri에서 실행할 수 있다.

- “시리야, 포스텍 아침”
- “시리야, 포스텍 점심”
- “시리야, 포스텍 저녁”
- “시리야, 포스텍 밥”

사용자의 기기에 단축어가 추가되어 있고 Siri가 켜져 있으면 별도 등록 없이 사용할 수 있다.

## 단축어 액션 설계

1. 현재 날짜를 `yyyyMMdd`로 포맷한다.
2. GitHub Pages에 캐시된 오늘 식단을 먼저 가져온다.
3. 캐시가 비었거나 날짜가 맞지 않으면 포스텍 홈페이지에서 다시 조회한다.
4. 각 Dictionary를 반복한다.
5. `type`이 단축어의 대상 식사와 맞는 항목만 선택한다.
   - 조식: `BREAKFAST_A`, `BREAKFAST_B`
   - 점심: `LUNCH`
   - 저녁: `DINNER`
   - 전체: 위 타입 전체
6. `foods.name_kor`, `kcal`, `protein`을 텍스트로 조립한다.
7. 결과를 팝업으로 표시한다.

## 빌드/서명

소스는 `shortcuts/src/*.cherri`에 있다.

```bash
npm run build:shortcuts
```

GitHub Actions는 public repo의 GitHub-hosted macOS runner에서 signed artifact를 생성한다.
