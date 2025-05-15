
const brothers = ['겸손부 - 이태섭', '겸손부 - 김진우', '겸손부 - 이동환', '겸손부 - 김지석', '겸손부 - 전도영', '겸손부 - 김권비', '겸손부 - 김민호', '겸손부 - 남준혁', '겸손부 - 최재혁', '겸손부 - 김인수', '겸손부 - 문지훈', '겸손부 - 전호성', '겸손부 - 박지웅', '겸손부 - 김두현', '겸손부 - 박효원', '온유부 - 양인수', '온유부 - 김호진', '온유부 - 이상수', '온유부 - 정형기', '온유부 - 박수용', '온유부 - 고병인', '온유부 - 이동길', '온유부 - 정인교', '온유부 - 권세빈', '온유부 - 김용빈', '온유부 - 김승후', '온유부 - 홍정의', '온유부 - 김민성', '온유부 - 하현성', '온유부 - 김진우2', '온유부 - 전은섭', '사랑부 - 신창현', '사랑부 - 임우혁', '사랑부 - 정용진', '사랑부 - 강민구', '사랑부 - 노현준', '사랑부 - 양홍열', '사랑부 - 김해원', '사랑부 - 백진호', '사랑부 - 김교식', '사랑부 - 이신섭', '사랑부 - 조시형', '사랑부 - 임향원', '사랑부 - 심어진', '사랑부 - 오서준', '사랑부 - 임주용', '사랑부 - 김도건', '사랑부 - 이준희'];
const sisters = ['겸손부 - 전효진', '겸손부 - 고다영', '겸손부 - 남소연', '겸손부 - 김유나', '겸손부 - 정여진', '겸손부 - 심규리', '겸손부 - 김민서', '겸손부 - 박지혜', '겸손부 - 심재경', '겸손부 - 유지연', '겸손부 - 심예림', '겸손부 - 이소희', '겸손부 - 임도해', '겸손부 - 이현화', '겸손부 - 김소은', '겸손부 - 김이안', '온유부 - 김유진', '온유부 - 이지희', '온유부 - 김민지', '온유부 - 임윤지', '온유부 - 박다은', '온유부 - 유재나', '온유부 - 김세연', '온유부 - 김채연', '온유부 - 임민해', '온유부 - 한예은', '온유부 - 임연주', '온유부 - 최연서', '온유부 - 한가은', '사랑부 - 김혜련', '사랑부 - 강민지', '사랑부 - 최선영', '사랑부 - 정희주', '사랑부 - 박나은', '사랑부 - 라유리', '사랑부 - 하지원', '사랑부 - 김호연', '사랑부 - 유승비', '사랑부 - 김주연', '사랑부 - 강다빈', '사랑부 - 이주화', '사랑부 - 양정민', '사랑부 - 한다빈', '사랑부 - 유현지', '사랑부 - 이다연'];
const state = {};

function render() {
  const broWrap = document.getElementById("brothers");
  const sisWrap = document.getElementById("sisters");
  broWrap.innerHTML = sisWrap.innerHTML = "";

  const renderList = (list, container) => {
    list.forEach(name => {
      const div = document.createElement("div");
      div.innerText = name;
      div.className = "card";
      div.onclick = () => toggle(name, div);
      updateCard(div, name);
      container.appendChild(div);
    });
  };

  renderList(brothers, broWrap);
  renderList(sisters, sisWrap);
}

function toggle(name, div) {
  if (!state[name]) state[name] = { car: true, flex: false, exclude: false };
  else if (state[name].car) state[name] = { car: false, flex: true, exclude: false };
  else if (state[name].flex) state[name] = { car: false, flex: false, exclude: true };
  else state[name] = { car: false, flex: false, exclude: false };
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
  const all = [...brothers, ...sisters];
  const passengers = all.filter(n => !state[n]?.car && !state[n]?.exclude);
  const drivers = all.filter(n => state[n]?.car);
  const driverList = drivers.map(d => ({
    name: d,
    gender: brothers.includes(d) ? "형제" : "자매",
    flex: state[d]?.flex,
    list: []
  }));

  const assignQueue = [];
  for (const p of passengers) {
    const gender = brothers.includes(p) ? "형제" : "자매";
    const eligible = driverList.filter(d => d.flex || d.gender === gender);
    if (eligible.length > 0) assignQueue.push({ name: p, choices: eligible });
  }

  for (const p of assignQueue) {
    p.choices.sort((a, b) => a.list.length - b.list.length)[0].list.push(p.name);
  }

  const results = driverList.map(d =>
    `${d.name} 차량 → ${d.list.join(", ") || "탑승자 없음"}`
  );
  const text = results.join("\n");
  document.getElementById("result").innerText = text;
  localStorage.setItem("lastAssignment", text);
  localStorage.setItem("personStates", JSON.stringify(state));
}

function confirmReset(type) {
  const msg = {
    all: "정말 모든 상태를 리셋하시겠습니까?",
    result: "정말 배정 결과만 리셋하시겠습니까?",
    exclude: "정말 제외 상태만 해제하시겠습니까?"
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
      if (state[name].exclude) state[name].exclude = false;
    }
    render();
    localStorage.setItem("personStates", JSON.stringify(state));
  }
}

window.onload = () => {
  const savedState = localStorage.getItem("personStates");
  if (savedState) Object.assign(state, JSON.parse(savedState));
  render();
  const savedResult = localStorage.getItem("lastAssignment");
  if (savedResult) document.getElementById("result").innerText = savedResult;
};
