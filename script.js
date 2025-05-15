
const brothers = ["겸손부 - 김진우", "온유부 - 김도건", "사랑부 - 김민성"];
const sisters = ["겸손부 - 전효진", "온유부 - 박다은", "사랑부 - 라유리"];
const state = {};

function render() {
  const bro = document.getElementById("brothers");
  const sis = document.getElementById("sisters");
  bro.innerHTML = "";
  sis.innerHTML = "";

  const renderList = (list, wrap) => {
    list.forEach(name => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerText = name;
      div.onclick = () => toggleState(name, div);
      updateCard(div, name);
      wrap.appendChild(div);
    });
  };

  renderList(brothers, bro);
  renderList(sisters, sis);
}

function toggleState(name, div) {
  if (!state[name]) state[name] = { car: true, flex: false, exclude: false };
  else if (state[name].car) state[name] = { car: false, flex: true, exclude: false };
  else if (state[name].flex) state[name] = { car: false, flex: false, exclude: true };
  else state[name] = { car: false, flex: false, exclude: false };
  updateCard(div, name);
}

function updateCard(div, name) {
  div.className = "card";
  const s = state[name];
  if (s?.exclude) div.classList.add("red");
  else if (s?.car) div.classList.add("green");
  else if (s?.flex) div.classList.add("blue");
}


function assignCars() {
  const passengers = [...brothers, ...sisters].filter(n => !state[n]?.car && !state[n]?.exclude);
  const drivers = [...brothers, ...sisters].filter(n => state[n]?.car);
  if (drivers.length === 0) return alert("운전자가 없습니다.");

  const groups = Array.from({ length: drivers.length }, () => []);
  let i = 0;

  for (const p of passengers) {
    groups[i % drivers.length].push(p);
    i++;
  }

  const results = drivers.map((driver, idx) => {
    const isFlex = state[driver]?.flex;
    const driverGender = brothers.includes(driver) ? "형제" : "자매";
    const group = groups[idx].filter(p => {
      const gender = brothers.includes(p) ? "형제" : "자매";
      return isFlex || gender === driverGender;
    });
    return `${driver} 차량 → ${group.join(", ") || "탑승자 없음"}`;
  });

  const resultText = results.join("
");
  document.getElementById("result").innerText = resultText;
  localStorage.setItem("lastAssignment", resultText);
}


    results.push(`${driver} 차량 → ${group.join(", ") || "탑승자 없음"}`);
  }

  const result = results.join("\n");
  document.getElementById("result").innerText = result;
  localStorage.setItem("lastAssignment", result);
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

function confirmReset(type) {
  const msg = {
    all: "정말 모든 상태를 리셋하시겠습니까?",
    result: "정말 배정 결과만 리셋하시겠습니까?",
    exclude: "정말 제외 상태만 해제하시겠습니까?"
  };
  if (!confirm(msg[type])) return;

  if (type === 'all') {
    localStorage.clear();
    location.reload();
  } else if (type === 'result') {
    localStorage.removeItem("lastAssignment");
    document.getElementById("result").innerText = "";
  } else if (type === 'exclude') {
    for (const name in state) {
      if (state[name].exclude) state[name].exclude = false;
    }
    render();
  }
}
