
const brotherGroups = {"겸손부": ["이태섭", "김진우", "이동환", "김지석", "전도영", "김권비", "김민호", "남준혁", "최재혁", "김인수", "문지훈", "전호성", "박지웅", "김두현", "박효원"], "온유부": ["양인수", "김호진", "이상수", "정형기", "박수용", "고병인", "이동길", "정인교", "권세빈", "김용빈", "김승후", "홍정의", "김민성", "하현성", "김진우2", "전은섭"], "사랑부": ["신창현", "임우혁", "정용진", "강민구", "노현준", "양홍열", "김해원", "백진호", "김교식", "이신섭", "조시형", "임향원", "심어진", "오서준", "임주용", "김도건", "이준희"]};
const sisterGroups = {"겸손부": ["전효진", "고다영", "남소연", "김유나", "정여진", "심규리", "김민서", "박지혜", "심재경", "유지연", "심예림", "이소희", "임도해", "이현화", "김소은", "김이안"], "온유부": ["김유진", "이지희", "김민지", "임윤지", "박다은", "유재나", "김세연", "김채연", "임민해", "한예은", "임연주", "최연서", "한가은"], "사랑부": ["김혜련", "강민지", "최선영", "정희주", "박나은", "라유리", "하지원", "김호연", "유승비", "김주연", "강다빈", "이주화", "양정민", "한다빈", "유현지", "이다연"]};
const state = {};

function render() {
  const broWrap = document.getElementById("brothers");
  const sisWrap = document.getElementById("sisters");
  broWrap.innerHTML = sisWrap.innerHTML = "";

  const renderGroup = (groups, wrap, list) => {
    for (const dept in groups) {
      const title = document.createElement("div");
      title.className = "section-title";
      title.innerText = dept;
      wrap.appendChild(title);
      groups[dept].forEach(name => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerText = name;
        div.onclick = () => toggle(name, div);
        updateCard(div, name);
        wrap.appendChild(div);
        list.push(name);
      });
    }
  };

  window.brothers = [];
  window.sisters = [];
  renderGroup(brotherGroups, broWrap, brothers);
  renderGroup(sisterGroups, sisWrap, sisters);
}

function toggle(name, div) {
  const current = state[name] || { car: false, flex: false, exclude: false };

  if (!state[name]) {
    state[name] = { car: true, flex: false, exclude: false }; // 첫 클릭 = 초록
  } else if (current.car) {
    state[name] = { car: false, flex: true, exclude: false }; // 초록 → 파랑
  } else if (current.flex) {
    state[name] = { car: false, flex: false, exclude: true }; // 파랑 → 빨강
  } else if (current.exclude) {
    delete state[name]; // 빨강 → 회색(삭제)
  }

  updateCard(div, name);
  localStorage.setItem("personStates", JSON.stringify(state));
}

function updateCard(div, name) {
  div.className = "card";
  const s = state[name];
  if (s?.exclude) div.classList.add("red");
  else if (s?.car) div.classList.add("green");
  else if (s?.flex) div.classList.add("blue");
}

function assignCars() {
  const broDrivers = brothers.filter(n => state[n]?.car || state[n]?.flex);
  const sisDrivers = sisters.filter(n => state[n]?.car || state[n]?.flex);  
  const broPassengers = brothers.filter(n => !state[n]?.car && !state[n]?.flex && !state[n]?.exclude);
  const sisPassengers = sisters.filter(n => !state[n]?.car && !state[n]?.flex && !state[n]?.exclude);
  const driverList = [...broDrivers, ...sisDrivers].map(n => {
    return {
      name: n,
      gender: brothers.includes(n) ? "형제" : (sisters.includes(n) ? "자매" : ""),
      flex: state[n]?.flex,
      list: []
    };
  });

  function distribute(passengers, gender) {
  const fixed = driverList.filter(d => d.gender === gender && !d.flex);
  const flex = driverList.filter(d => d.flex);
  const targets = fixed.concat(flex); // 순서 유지, 랜덤 아님

  // 탑승자 랜덤 섞기
  for (let i = passengers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passengers[i], passengers[j]] = [passengers[j], passengers[i]];
  }

  // 균등하게 분배
  
  let i = 0;
for (let p of passengers) {
  let assigned = false;
  let attempts = 0;
  while (!assigned && attempts < targets.length) {
    const target = targets[i % targets.length];
    if (target.list.length < 3) {
      target.list.push(p);
      assigned = true;
    }
    i++;
    attempts++;
  }
  if (!assigned) {
    unassigned.push(p);
  }
}
  }    
  distribute(broPassengers, "형제");
  distribute(sisPassengers, "자매");

  const result = driverList.map(d => `${d.name} 차량 → ${d.list.join(", ") || "탑승자 없음"}`).join("\n");
  document.getElementById("result").innerText = result;
  localStorage.setItem("lastAssignment", result);
  localStorage.setItem("personStates", JSON.stringify(state));

  const neededBro = Math.max(0, Math.ceil(broPassengers.length / 3) - broDrivers.length);
  const neededSis = Math.max(0, Math.ceil(sisPassengers.length / 3) - sisDrivers.length);
  if (neededBro > 0 || neededSis > 0) {
    let msg = "탑승 인원이 부족합니다.";
    if (neededBro > 0) msg += `\n형제 차량이 최소 ${neededBro}대 더 필요합니다.`;
    if (neededSis > 0) msg += `\n자매 차량이 최소 ${neededSis}대 더 필요합니다.`;
    alert(msg);
  }
}

function confirmReset(type) {
  const msg = {
    all: "정말 모든 상태를 리셋하시겠습니까?",
    result: "정말 배정 결과만 리셋하시겠습니까?",
    exclude: "정말 회색/초록/파랑만 리셋하시겠습니까?"
  };
  if (!confirm(msg[type])) return;

  if (type === "all") {
    localStorage.clear();
    location.reload();
  } else if (type === "result") {
    localStorage.removeItem("lastAssignment");
    document.getElementById("result").innerText = "";
  } else if (type === "exclude") {
    for (const name in state) {
      if (!state[name].exclude) delete state[name];
    }
    render();
    localStorage.setItem("personStates", JSON.stringify(state));
  }
}

window.onload = () => {
  const saved = localStorage.getItem("personStates");
  if (saved) Object.assign(state, JSON.parse(saved));
  render();
  const res = localStorage.getItem("lastAssignment");
  if (res) document.getElementById("result").innerText = res;
};
