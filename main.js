const KEY = "taiao-v0.1";

const kaitiaki = {
  name: "Koru",

  rhythm: {
    activeTime: "day"
  },

  limits: {
    playEnergy: 20,
    exploreEnergy: 18
  }
};

const defaultState = {
  name: "Koru",
  hunger: 70,
  happiness: 70,
  energy: 70,
  lastSeen: Date.now()
};

let state = loadState();

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!saved) return { ...defaultState };

    const elapsedHours = Math.max(0, (Date.now() - saved.lastSeen) / 3600000);
    return {
      ...defaultState,
      ...saved,
      hunger: clamp(saved.hunger - elapsedHours * 4),
      happiness: clamp(saved.happiness - elapsedHours * 2),
      energy: clamp(saved.energy - elapsedHours * 1.5),
      lastSeen: Date.now()
    };
  } catch {
    return { ...defaultState };
  }
}

function save() {
  state.lastSeen = Date.now();
  localStorage.setItem(KEY, JSON.stringify(state));
  document.querySelector("#saveStatus").textContent = "Saved";
}

function setSpeech(text) {
  document.querySelector("#speech").textContent = text;
}

function mood() {
  if (state.energy < 20) return "😴";
  if (state.hunger < 20) return "🥺";
  if (state.happiness < 20) return "😔";
  
  const average = (state.hunger + state.happiness + state.energy) / 3;
  
  if (average >= 80) return "🤩";
  if (average >= 60) return "😊";
  if (average >= 40) return "🙂";
  if (average >= 20) return "😟";
  return "🥺";
}
function moodMessage() {
  if (state.energy < 20) {
  return {
    reo: "Kei te ngenge ahau.",
    english: "I'm really tired."
  };
}
if (state.hunger < 20) {
  return {
    reo: "Kei te hiakai ahau.",
    english: "I'm hungry."
  };
}
if (state.happiness < 20) {
  return {
    reo: "Me tākaro tāua.",
    english: "Let's play together."
  };
}
  const average = (state.hunger + state.happiness + state.energy) / 3;

  if (average >= 80) {
    return {
      reo: "Kei te pai rawa atu au!",
      english: "I'm feeling amazing!"
    };
  }

  if (average >= 60) {
    return {
      reo: "Kei te pai au.",
      english: "I'm doing well."
    };
  }

  if (average >= 40) {
    return {
      reo: "Kei te pai tonu au.",
      english: "I'm okay for now."
    };
  }

  if (average >= 20) {
    return {
      reo: "Āwhinatia mai.",
      english: "I could use some care."
    };
  }

  return {
    reo: "Kei te hiahia au ki a koe.",
    english: "I need you."
  };
}
function render() {
  const values = {
    hunger: state.hunger,
    happiness: state.happiness,
    energy: state.energy
  };

  for (const [key, value] of Object.entries(values)) {
    document.querySelector(`#${key}Value`).textContent = Math.round(value);
    document.querySelector(`#${key}Bar`).style.width = `${value}%`;
  }

  document.querySelector("#name").textContent = state.name;
  document.querySelector("#mood").textContent = mood();

const message = moodMessage();
  document.querySelector("#moodReo").textContent = message.reo;
  document.querySelector("#moodEnglish").textContent = message.english;
}

setInterval(() => {
  const now = Date.now();
  const elapsedHours = Math.max(0, (now - state.lastSeen) / 3600000);

  state.hunger = Math.max(0, state.hunger - elapsedHours * 4);
  state.happiness = Math.max(0, state.happiness - elapsedHours * 2);
  state.energy = Math.max(0, state.energy - elapsedHours * 1.5);
  state.lastSeen = now;

  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}, 1000);
const discoveries = [
  ["He wā hou", "A new moment in TAIAO. Take a breath and look around."],
  ["Te ngahere", "The forest is alive with tiny discoveries."],
  ["Ngā manu", "Listen carefully — the world around you has its own voices."],
  ["Te awa", "Your companion wants to explore somewhere new."],
  ["Kupu hou", "Try learning one new kupu together today."]
];

function discover() {
  const item = discoveries[Math.floor(Math.random() * discoveries.length)];
  document.querySelector("#discoveryTitle").textContent = item[0];
  document.querySelector("#discoveryText").textContent = item[1];
}

function animate() {
  const creature = document.querySelector("#creature");
  creature.classList.remove("bounce");
  void creature.offsetWidth;
  creature.classList.add("bounce");
}

function act(action) {
  if (action === "feed") {
    state.hunger = clamp(state.hunger + 22);
    state.happiness = clamp(state.happiness + 3);
    setSpeech("Ka pai! 🍃");
  }

  if (action === "play") {
    if (state.energy < kaitiaki.limits.playEnergy) {
      setSpeech("Kāo... me okioki au. 😴");
      return;
      } else {
      state.happiness = clamp(state.happiness + 18);
      state.energy = clamp(state.energy - 12);
      state.hunger = clamp(state.hunger - 5);
      setSpeech("Tākaro! 🎉");
    }
  }

  if (action === "rest") {
    state.energy = clamp(state.energy + 25);
    state.happiness = clamp(state.happiness + 2);
    setSpeech("Okioki… 🌙");
  }

  if (action === "explore") {
    if (state.energy < 18) {
      setSpeech("Me okioki tātou. 🌙");
    } else {
      state.energy = clamp(state.energy - 15);
      state.hunger = clamp(state.hunger - 7);
      state.happiness = clamp(state.happiness + 12);
      setSpeech("Tūhura! 🌿");
      discover();
    }
  }

  animate();
  render();
  save();
}
function autonomousMoment() {
  // Rangi sometimes expresses a need without being asked.

  if (state.hunger < 30) {
    setSpeech("Kei te hiakai ahau… 🍎");
    return;
  }

  if (state.energy < 30) {
    setSpeech("Okioki? 🌙");
    return;
  }

  if (state.happiness < 30) {
    setSpeech("Me tākaro tāua. 🎮");
    return;
  }
  if (
  state.hunger >= 60 &&
  state.energy >= 60 &&
  state.happiness >= 60
) {
  const happyMoments = [
    "He rā pai tēnei. ☀️",
    "Kia pai te noho. 🌿",
    "Titiro! 👀",
    "Ka mau te wehi! ✨"
  ];

  const message = happyMoments[Math.floor(Math.random() * happyMoments.length)];
  setSpeech(message);
}
}

document.querySelectorAll("[data-action]").forEach(button => {
  button.addEventListener("click", () => act(button.dataset.action));
});

document.querySelector("#renameBtn").addEventListener("click", () => {
  const newName = prompt("What would you like to name your TAIAO companion?", state.name);

  if (newName === null) return;

  const cleanedName = newName.trim();

  if (!cleanedName) {
    alert("Please enter a name.");
    return;
  }

  if (cleanedName.length > 20) {
    alert("Please choose a name with 20 characters or fewer.");
    return;
  }

  state.name = cleanedName;
  save();
  render();
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  if (!confirm("Start a new TAIAO companion?")) return;
  state = { ...defaultState, lastSeen: Date.now() };
  save();
  setSpeech("Kia ora! 👋");
  discover();
  render();
});

setInterval(() => {
  if (Math.random() < 0.35) {
    autonomousMoment();
  }
}, 15000);

render();
discover();
