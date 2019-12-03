# Proxy 

- TODO List
    - [X] `Ask-MedicineList`
    - [X] `Ask-whatToTake`
    - [ ] `Change-medicationInfo`
    - [ ] `Check-MedicineToTake`
    - [ ] `Check-MedicineTaken`
    - [X] `Delete-MedicationInfo`
    - [X] `Input-MedicationInfo`

- UPDATE
    1. 타임존 에러를 해결하기 위해 `moment-timezone`을 설치함. (기존의 `moment`도 사용)
        ```
        npm install moment-timezone
        ```

- Trigger별로 Controller 나눔
    1. `Ask-MedicineList`
    2. `Ask-whatToTake`
    3. `Change-medicationInfo`
    4. `Check-MedicineToTake`
    5. `Check-MedicineTaken`
    6. `Delete-MedicationInfo`
    7. `Input-MedicationInfo`

- ACTION 이름으로 Backend Proxy가 전달되기때문에, router을 쪼갤 수가 없어서 `/routes/index.js`에 모두 나열된 후, 각 트리거별로 Controller에 전달됨.
