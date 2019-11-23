# Proxy 

- Question List
    - [ ] `OAuth 2.0` 등록
    - [ ] Response JSON 형식 어떻게되는지 (SKT에서 보여준 Response Sample형식으로 만들어서 반환해야 하는지, 아니면 key:value만 담은 JSON 형식을 반환하면 SKT에서 자동으로 Response JSON 형식을 만들어주는지.)
    - [ ] Response JSON의 OUTPUT 내의 values 값이 list나 json type이 되어도 되는지
    - [ ] `Check.MedicineTaken` (메디저 오늘 약 먹은거 뭐야?)에서 medicineTakenInfo와 medicineUntakenInfo를 Backend parameter로 반환해야 하는데, 여기서 알람 이름(scheName)만 반환하면 되는지, 아니면 알람이름(scheName)과 약 이름(medicineName) 두 개를 모두 반환해야 하는지. 두 개 모두 반환한다면, 
    ```json
    {
        medicineTakenInfo: {
            scheName: alarm1, 
            medicineName: medicine1
        }
    }
    ```
    형식의 JSON Type으로 반환하면 되는지.

- Trigger별로 Controller 나눔
    1. `Ask.MedicineList`
    2. `Ask.whatToTake`
    3. `Change.medicationInfo`
    4. `Check.MedicineToTake`
    5. `Check.MedicineTaken`
    6. `Check.MedicineToTake`
    7. `Delete.MedicationInfo`
    8. `Input.MedicationInfo`

- ACTION 이름으로 Backend Proxy가 전달되기때문에, router을 쪼갤 수가 없어서 `index.js`에 모두 나열될 예정.
