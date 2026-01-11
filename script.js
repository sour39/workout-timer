const workout = [
  { name: "プランク", time: 30, desc: "肘は肩の下。頭からかかとまで一直線。" },
  { name: "休憩", time: 10, desc: "呼吸を整えましょう。" },
  { name: "サイドプランク（右）", time: 20, desc: "体を一直線に保つ。" },
  { name: "休憩", time: 10, desc: "リラックス。" },
  { name: "サイドプランク（左）", time: 20, desc: "腰が落ちないように。" },
  { name: "休憩", time: 10, desc: "次が来ます。" },
  { name: "デッドバグ", time: 30, desc: "腰は床につけたまま。" },
  { name: "休憩", time: 10, desc: "ラスト！" },
  { name: "ヒップリフト", time: 30, desc: "お尻を締めて持ち上げる。" }
];

let index = 0;
let remaining = 0;
let interval = null;
let isRunning = false;
let isPaused = false;

function speak(text) {
  const uttr = new SpeechSynthesisUtterance(text);
  uttr.lang = "ja-JP";
  speechSynthesis.cancel();
  speechSynthesis.speak(uttr);
}

function togglePause() {
  const btn = document.getElementById("toggleBtn");

  // 初回スタート
  if (!isRunning) {
    isRunning = true;
    isPaused = false;
    btn.textContent = "⏸ 一時停止";
    index = 0;
    startCurrent();
    return;
  }

  // 一時停止
  if (!isPaused) {
    clearInterval(interval);
    interval = null;
    speechSynthesis.cancel();
    isPaused = true;
    btn.textContent = "▶ 再開";
    document.getElementById("description").textContent = "一時停止中";
    return;
  }

  // 再開
  isPaused = false;
  btn.textContent = "⏸ 一時停止";
  startInterval();
}

function updateProgress() {
  const progress = ((index + 1) / workout.length) * 100;
  document.getElementById("progressText").textContent = `${index + 1} / ${workout.length}`;
  document.getElementById("progressFill").style.width = `${progress}%`;
}

function startCurrent() {
  const item = workout[index];
  remaining = item.time;

  document.getElementById("exercise").textContent = item.name;
  document.getElementById("description").textContent = item.desc;
  document.getElementById("timer").textContent = remaining;
  updateProgress();

  speak(`${item.name}、${remaining}秒スタート`);
  startInterval();
}

function startInterval() {
  interval = setInterval(() => {
    remaining--;
    document.getElementById("timer").textContent = remaining;

    if (remaining === 5) {
      speak("残り5秒");
    }

    if (remaining <= 0) {
      clearInterval(interval);
      index++;
      if (index >= workout.length) {
        finishWorkout();
      } else {
        startCurrent();
      }
    }
  }, 1000);
}

function stopWorkout() {
  clearInterval(interval);
  interval = null;
  speechSynthesis.cancel();

  isRunning = false;
  isPaused = false;
  index = 0;

  document.getElementById("exercise").textContent = "中断しました";
  document.getElementById("description").textContent = "スタートで最初から";
  document.getElementById("timer").textContent = "⏹";
  document.getElementById("toggleBtn").textContent = "▶ スタート";
  document.getElementById("progressText").textContent = "- / -";
  document.getElementById("progressFill").style.width = "0%";
}

function finishWorkout() {
  isRunning = false;
  isPaused = false;
  document.getElementById("exercise").textContent = "終了！";
  document.getElementById("description").textContent = "お疲れさまでした";
  document.getElementById("timer").textContent = "🎉";
  document.getElementById("toggleBtn").textContent = "▶ スタート";
  document.getElementById("progressText").textContent = `${workout.length} / ${workout.length}`;
  document.getElementById("progressFill").style.width = "100%";
  speak("お疲れさまでした。トレーニング終了です。");
}

// Service Worker 登録（PWA）
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
