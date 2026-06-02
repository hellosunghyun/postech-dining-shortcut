# Shortcuts

이 디렉터리는 배포할 Apple Shortcuts 파일을 보관한다.

## 만들 단축어

- `포스텍 아침`
- `포스텍 점심`
- `포스텍 저녁`
- `포스텍 밥`

각 단축어는 같은 API와 포맷 설정을 쓰고, `meal` 값만 다르게 둔다.

## 단축어 액션 설계

1. 현재 날짜를 `yyyyMMdd`로 포맷한다.
2. URL을 만든다.
   - `https://food.podac.poapper.com/v1/menus/period/{date}/{date}`
3. `URL 내용 가져오기`로 JSON을 가져온다.
4. 각 Dictionary를 반복한다.
5. `type`이 단축어의 대상 식사와 맞는 항목만 선택한다.
   - 조식: `BREAKFAST_A`, `BREAKFAST_B`
   - 점심: `LUNCH`
   - 저녁: `DINNER`
   - 전체: 위 타입 전체
6. `foods.name_kor`, `kcal`, `protein`을 텍스트로 조립한다.
7. 결과를 `빠른 보기`, `알림 보기`, `클립보드 복사`, `메시지 보내기` 중 원하는 액션으로 전달한다.

## 빌드/서명

소스는 `shortcuts/src/*.cherri`에 있다.

```bash
npm run build:shortcuts
```

GitHub Actions는 public repo의 GitHub-hosted macOS runner에서 signed artifact를 생성한다.
