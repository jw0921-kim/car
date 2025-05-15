
const brotherGroups = {
  "겸손부": ["이태섭", "김진우", "이동환", "김지석", "전도영", "김권비", "김민호", "남준혁", "최재혁", "김인수", "문지훈", "전호성", "박지웅", "김두현", "박효원"],
  "온유부": ["양인수", "김호진", "이상수", "정형기", "박수용", "고병인", "이동길", "정인교", "권세빈", "김용빈", "김승후", "홍정의", "김민성", "하현성", "김진우2", "전은섭"],
  "사랑부": ["신창현", "임우혁", "정용진", "강민구", "노현준", "양홍열", "김해원", "백진호", "김교식", "이신섭", "조시형", "임향원", "심어진", "오서준", "임주용", "김도건", "이준희"]
};
const sisterGroups = {
  "겸손부": ["전효진", "고다영", "남소연", "김유나", "정여진", "심규리", "김민서", "박지혜", "심재경", "유지연", "심예림", "이소희", "임도해", "이현화", "김소은", "김이안"],
  "온유부": ["김유진", "이지희", "김민지", "임윤지", "박다은", "유재나", "김세연", "김채연", "임민해", "한예은", "임연주", "최연서", "한가은"],
  "사랑부": ["김혜련", "강민지", "최선영", "정희주", "박나은", "라유리", "하지원", "김호연", "유승비", "김주연", "강다빈", "이주화", "양정민", "한다빈", "유현지", "이다연"]
};
const state = {};

function render() {
  const broWrap = document.getElementById("brothers");
  const sisWrap = document.getElementById("sisters");
  broWrap.innerHTML = sisWrap.innerHTML = "";

  const renderGroup = (wrap, groups, list) => {
    for (const dept in groups) {
      const label = document.createElement("div");
      label.innerText = dept;
      label.className = "card-label";
      wrap.appendChild(label);

      groups[dept].forEach(name => {
        const div = document.createElement("div");
        div.innerText = name;
        div.className = "card";
        div.onclick = () => toggle(name, div);
        updateCard(div, name);
        wrap.appendChild(div);
        list.push(name);
      });
    }
  };

  window.brothers = [], window.sisters = [];
  renderGroup(broWrap, brotherGroups, brothers);
  renderGroup(sisWrap, sisterGroups, sisters);
}

function toggle(name, div) {
  if (!state[name]) state[name] = { car: true, flex: false, exclude: false };
  else if (state[name].car) state[name] = { car: false, flex: true, exclude: false };
  else if (state[name].flex) state[name] = { car: false, flex: false, exclude: true };
  else state[name] = { car: false, flex: false, exclude: false };
  updateCard(div, name);
}

function updateCard(div, name) {
  div.className = "card";
  div.style.background = "";
  const s = state[name];
  if (s?.exclude) div.style.background = "#fca5a5";
  else {
    if (s?.car) div.classList.add("car");
    if (s?.flex) div.classList.add("flexible");
  }
}

function assignCars() {
  const all = [...brothers, ...sisters];
  const passengers = all.filter(n => !state[n]?.car && !state[n]?.exclude);
  const drivers = all.filter(n => state[n]?.car);
  if (drivers.length === 0) return alert("운전자가 없습니다.");
  const perCar = Math.ceil(passengers.length / drivers.length);
  let unassigned = [...passengers];
  const results = [];

  for (let driver of drivers) {
    const group = [];
    const isFlex = state[driver]?.flex;
    const driverGender = brothers.includes(driver) ? "형제" : "자매";
    for (let i = 0; i < unassigned.length; i++) {
      const p = unassigned[i];
      const gender = brothers.includes(p) ? "형제" : "자매";
      if (isFlex || driverGender === gender) {
        group.push(p);
        unassigned.splice(i, 1);
        i--;
      }
      if (group.length >= perCar) break;
    }
    results.push(`${driver} 차량 → ${group.join(", ") || "탑승자 없음"}`);
  }

  document.getElementById("result").innerText = results.join("\n");
  localStorage.setItem("lastAssignment", results.join("\n"));
  if (unassigned.length > 0) alert("일부 인원이 배정되지 않았습니다.");
}

function resetAll() {
  localStorage.clear();
  location.reload();
}

window.onload = () => {
  render();
  const saved = localStorage.getItem("lastAssignment");
  if (saved) document.getElementById("result").innerText = saved;
};
