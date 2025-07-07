let [ms, sec, min, hr] = [0, 0, 0, 0];
let timer = null;

const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");
const msSpan = document.getElementById("ms");
const laps = document.getElementById("laps");

const toast = document.getElementById("lapToast");
const historyBubble = document.getElementById("historyBubble");
const historyList = document.getElementById("historyList");

document.getElementById("startBtn").addEventListener("click", () => {
  if (timer) clearInterval(timer);
  timer = setInterval(updateTime, 10);
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  clearInterval(timer);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(timer);
  [ms, sec, min, hr] = [0, 0, 0, 0];
  updateDisplay();
  laps.innerHTML = '';
});

document.getElementById("lapBtn").addEventListener("click", () => {
  let lapTime = formatTime(hr, min, sec, ms);
  let li = document.createElement("li");
  li.innerHTML = `Lap: ${lapTime} <span class="star-btn">☆</span>`;
  laps.appendChild(li);
  showToast("✔️ Lap Saved!");

  const starBtn = li.querySelector(".star-btn");
  starBtn.addEventListener("click", () => {
    starBtn.classList.toggle("starred");
    starBtn.textContent = starBtn.classList.contains("starred") ? "⭐" : "☆";

    if (starBtn.classList.contains("starred")) {
      saveToHistory(lapTime);
    }
  });
});

document.getElementById("historyBtn").addEventListener("click", () => {
  let history = JSON.parse(localStorage.getItem("starredLaps")) || [];
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = "<li>No starred laps yet.</li>";
  } else {
    history.forEach(t => {
      let li = document.createElement("li");
      li.textContent = t;
      historyList.appendChild(li);
    });
  }

  historyBubble.style.display = "block";
});

document.querySelector(".close-bubble").onclick = () => {
  historyBubble.style.display = "none";
};

function updateTime() {
  ms += 10;
  if (ms >= 1000) {
    ms = 0;
    sec++;
    if (sec >= 60) {
      sec = 0;
      min++;
      if (min >= 60) {
        min = 0;
        hr++;
      }
    }
  }
  updateDisplay();
}

function updateDisplay() {
  h.innerText = hr.toString().padStart(2, '0');
  m.innerText = min.toString().padStart(2, '0');
  s.innerText = sec.toString().padStart(2, '0');
  msSpan.innerText = Math.floor(ms / 10).toString().padStart(2, '0');
}

function formatTime(hr, min, sec, ms) {
  return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${Math.floor(ms/10).toString().padStart(2, '0')}`;
}

function saveToHistory(time) {
  let history = JSON.parse(localStorage.getItem("starredLaps")) || [];
  history.push(time);
  localStorage.setItem("starredLaps", JSON.stringify(history));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}
