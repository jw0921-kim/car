
const brotherGroups = {
  "겸손부": ["이태섭", "김진우"],
  "온유부": ["양인수", "김호진"],
  "사랑부": ["신창현", "임우혁"]
};
const sisterGroups = {
  "겸손부": ["전효진", "고다영"],
  "온유부": ["김유진", "이지희"],
  "사랑부": ["김혜련", "강민지"]
};
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
        div.dataset.dept = dept;
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
  if (!state[name]) state[name] = { car: true, flex: false, exclude: false };
  else if (current.car) state[name] = { car: false, flex: true, exclude: false };
  else if (current.flex) state[name] = { car: false, flex: false, exclude: true };
  else delete state[name];
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
  const deptPref = document.getElementById("deptToggle").checked;
  const broDrivers = brothers.filter(n => state[n]?.car || state[n]?.flex);
  const sisDrivers = sisters.filter(n => state[n]?.car || state[n]?.flex);
  const broPassengers = brothers.filter(n => !state[n]?.car && !state[n]?.flex && !state[n]?.exclude);
  const sisPassengers = sisters.filter(n => !state[n]?.car && !state[n]?.flex && !state[n]?.exclude);

  const driverList = [...broDrivers, ...sisDrivers].map(n => {
    return {
      name: n,
      gender: brothers.includes(n) ? "형제" : "자매",
      flex: state[n]?.flex,
      dept: getDept(n),
      list: []
    };
  });

  function getDept(name) {
    for (const d in brotherGroups) if (brotherGroups[d].includes(name)) return d;
    for (const d in sisterGroups) if (sisterGroups[d].includes(name)) return d;
    return "";
  }

  function distribute(passengers, gender) {
    passengers = [...passengers];
    for (let i = passengers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passengers[i], passengers[j]] = [passengers[j], passengers[i]];
    }

    for (let p of passengers) {
      let candidates = driverList.filter(d => d.gender === gender && d.list.length < 3);
      if (deptPref) {
        const dept = getDept(p);
        const sameDept = candidates.filter(d => d.dept === dept);
        if (sameDept.length > 0) candidates = sameDept;
      }
      if (candidates.length === 0) continue;
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      chosen.list.push(p);
    }
  }

  distribute(broPassengers, "형제");
  distribute(sisPassengers, "자매");

  const result = driverList.map(d => `${d.name} 차량 → ${d.list.join(", ") || "탑승자 없음"}`).join("\n");
  document.getElementById("result").innerText = result;
}

window.onload = () => {
  const saved = localStorage.getItem("personStates");
  if (saved) Object.assign(state, JSON.parse(saved));
  render();
};
