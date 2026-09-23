# 세팅 분석 조사 기록

## 현재 상태

이전 raw snapshot은 인게임 수기 스탯과 동일 시점임을 검증하지 못해 제거했다.

현재는 `whisper-skill-level-14.manual-observation.json`의 수기 관측값만 확정 데이터로 사용한다. 이 데이터에는 같은 시점의 raw payload가 없다.

## 다음 수집 원칙

1. 인게임 상세 스탯을 먼저 기록한다.
2. 같은 상태에서 외부 API raw payload를 새로 조회한다.
3. 두 값의 공격력, 스킬 레벨, 선택 트라이포드를 대조한다.
4. 일치가 확인된 경우에만 raw payload와 피해 측정값을 하나의 스냅샷으로 저장한다.

## 참고 자료

- [로스트아크의 데미지 계산식 한 장 정리 및 해설](https://www.inven.co.kr/board/lostark/4821/109679): 비공식 가설 자료
- [LostHub - 반포동딜키리](https://losthub.cloud/info?q=%EB%B0%98%ED%8F%AC%EB%8F%99%EB%94%9C%ED%82%A4%EB%A6%AC): 비공식 정보 구조 참고 자료
