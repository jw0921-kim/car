
const brothers = ["이태섭", "김진우", "이동환", "김지석", "전도영", "김권비", "김민호", "남준혁", "최재혁", "김인수", "문지훈", "전호성", "박지웅", "김두현", "박효원"];
const sisters = ["전효진", "고다영", "남소연", "김유나", "정여진", "심규리", "김민서", "박지혜", "심재경", "유지연", "심예림", "이소희", "임도해", "이현화", "김소은", "김이안"];

const state = {};

function render() {
  const broWrap = document.getElementById("brothers");
  const sisWrap = document.getElementById("sisters");

  [broWrap, sisWrap].forEach(wrap => wrap.innerHTML = "");

  for (const [list, wrap, gender] of [[brothers, broWrap, '형제'], [sisters, sisWrap, '자매']]) {
    list.forEach(name => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerText = name;
      div.onclick = () => {
        if (!state[name]) state[name] = { car: false, flex: false };
        else if (!state[name].car) state[name].car = true;
        else if (!state[name].flex) state[name].flex = true;
        else state[name] = { car: false, flex: false };
        updateCard(div, name);
      };
      updateCard(div, name);
      wrap.appendChild(div);
    });
  }
}

function updateCard(div, name) {
  div.className = "card";
  if (state[name]?.car) div.classList.add("car");
  if (state[name]?.flex) div.classList.add("flexible");
}

function assignCars() {
  const passengers = [...brothers, ...sisters].filter(n => !state[n]?.car);
  const drivers = [...brothers, ...sisters].filter(n => state[n]?.car);
  const results = [];
  let passengerIdx = 0;

  for (let driver of drivers) {
    const group = [];
    while (group.length < 3 && passengerIdx < passengers.length) {
      group.push(passengers[passengerIdx++]);
    }
    results.push(`${driver} 차량 → ${group.join(", ") || "탑승자 없음"}`);
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = results.join("<br/>");

  if (passengerIdx < passengers.length) {
    alert("탑승 인원이 부족합니다. 성별 무관 태우기(파랑)로 토글해 주세요!");
  }
}

render();
