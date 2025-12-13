 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..3ca2d506a4d92e1713015ae0e8fa41a320135b3e
--- /dev/null
+++ b/script.js
@@ -0,0 +1,286 @@
+"use strict";
+
+const ITEMS = [
+  "Apple",
+  "Artichoke",
+  "Asparagus",
+  "Aubergine",
+  "Avocado",
+  "Banana",
+  "Bear",
+  "Blueberries",
+  "Book",
+  "Broccoli",
+  "Carrot",
+  "Cat",
+  "Cauliflower",
+  "Celery",
+  "Chair",
+  "Cherries",
+  "Clock",
+  "Coconut",
+  "Comb",
+  "Corn",
+  "Courgette",
+  "Cucumber",
+  "Cup",
+  "Deer",
+  "Dog",
+  "Dragonfruit",
+  "Duck",
+  "Elephant",
+  "Fish",
+  "Fork",
+  "Fox",
+  "Frog",
+  "Garlic",
+  "Giraffe",
+  "Glasses",
+  "Grapes",
+  "Horse",
+  "Kiwi",
+  "Lemon",
+  "Lettuce",
+  "Lime",
+  "Lion",
+  "Mango",
+  "Monkey",
+  "Mouse",
+  "Mushroom",
+  "Onion",
+  "Orange",
+  "Owl",
+  "Panda",
+  "Peach",
+  "Pear",
+  "Peas",
+  "Pencil",
+  "Penguin",
+  "Pepper",
+  "Pineapple",
+  "Plant",
+  "Pomegranate",
+  "Potato",
+  "Pumpkin",
+  "Rabbit",
+  "Raspberry",
+  "Remote",
+  "Rubberduck",
+  "Spinach",
+  "Spoon",
+  "Strawberry",
+  "Tiger",
+  "Toilet paper",
+  "Tomato",
+  "Toothbrush",
+  "Towel",
+  "Watermelon",
+];
+
+const QUESTIONS_PER_ROUND = 10;
+const IMAGE_FOLDER = "images/";
+const IMAGE_EXT = ".png";
+
+const $ = (id) => document.getElementById(id);
+
+const ui = {
+  start: $("start-screen"),
+  game: $("game-screen"),
+  end: $("end-screen"),
+  nameInput: $("player-name"),
+  startError: $("start-error"),
+  startBtn: $("start-button"),
+  restartBtn: $("restart-button"),
+  statName: $("stat-name"),
+  statProgress: $("stat-progress"),
+  statScore: $("stat-score"),
+  progressBar: $("progress-bar"),
+  image: $("item-image"),
+  blanks: $("blanks"),
+  guess: $("guess-input"),
+  checkBtn: $("check-button"),
+  nextBtn: $("next-button"),
+  feedback: $("feedback"),
+  endName: $("end-name"),
+  endSummary: $("end-summary"),
+};
+
+let state = {
+  player: "",
+  round: [],
+  index: 0,
+  score: 0,
+  locked: false,
+};
+
+function shuffle(arr) {
+  const copy = arr.slice();
+  for (let i = copy.length - 1; i > 0; i--) {
+    const j = Math.floor(Math.random() * (i + 1));
+    [copy[i], copy[j]] = [copy[j], copy[i]];
+  }
+  return copy;
+}
+
+function cleanAnswer(text) {
+  return (text || "")
+    .trim()
+    .toLowerCase()
+    .replace(/[^a-z]/g, "");
+}
+
+function makeBlankBoxes(word) {
+  ui.blanks.innerHTML = "";
+  const letters = word.replace(/\s+/g, "");
+  for (let i = 0; i < letters.length; i++) {
+    const box = document.createElement("span");
+    box.className = "blank-box";
+    box.textContent = "_";
+    ui.blanks.appendChild(box);
+  }
+}
+
+function setFeedback(message, mood) {
+  ui.feedback.textContent = message;
+  ui.feedback.classList.remove("ok", "bad");
+  if (mood === "ok") ui.feedback.classList.add("ok");
+  if (mood === "bad") ui.feedback.classList.add("bad");
+}
+
+function showScreen(screen) {
+  ui.start.hidden = true;
+  ui.game.hidden = true;
+  ui.end.hidden = true;
+  screen.hidden = false;
+}
+
+function setLocked(locked) {
+  state.locked = locked;
+  ui.guess.disabled = locked;
+  ui.checkBtn.disabled = locked;
+  ui.nextBtn.disabled = !locked;
+}
+
+function loadQuestion() {
+  const item = state.round[state.index];
+  const displayIndex = state.index + 1;
+  ui.statName.textContent = `Player: ${state.player}`;
+  ui.statProgress.textContent = `Question ${displayIndex} / ${QUESTIONS_PER_ROUND}`;
+  ui.statScore.textContent = `Score: ${state.score}`;
+  ui.progressBar.style.width = `${(displayIndex - 1) / QUESTIONS_PER_ROUND * 100}%`;
+
+  const imgName = encodeURIComponent(item) + IMAGE_EXT;
+  ui.image.src = IMAGE_FOLDER + imgName;
+  ui.image.alt = item;
+
+  makeBlankBoxes(item);
+  ui.guess.value = "";
+  ui.guess.focus();
+  ui.nextBtn.textContent = "Next picture";
+  setFeedback("", null);
+  setLocked(false);
+}
+
+function startGame() {
+  const name = ui.nameInput.value.trim();
+  if (!name) {
+    ui.startError.textContent = "Please type your name to begin.";
+    ui.nameInput.focus();
+    return;
+  }
+
+  ui.startError.textContent = "";
+  state = {
+    player: name,
+    round: shuffle(ITEMS).slice(0, QUESTIONS_PER_ROUND),
+    index: 0,
+    score: 0,
+    locked: false,
+  };
+
+  showScreen(ui.game);
+  loadQuestion();
+}
+
+function finishGame() {
+  const perfect = state.score === QUESTIONS_PER_ROUND;
+  const praise = perfect
+    ? "You nailed every word!"
+    : state.score >= QUESTIONS_PER_ROUND * 0.7
+      ? "Amazing spelling!"
+      : "Great effort—keep practicing!";
+
+  ui.endName.textContent = state.player;
+  ui.endSummary.textContent = `${state.score} out of ${QUESTIONS_PER_ROUND} correct. ${praise}`;
+  ui.progressBar.style.width = "100%";
+  showScreen(ui.end);
+}
+
+function checkAnswer() {
+  if (state.locked) return;
+  const item = state.round[state.index];
+  const expected = cleanAnswer(item);
+  const guess = cleanAnswer(ui.guess.value);
+
+  if (!guess) {
+    setFeedback("Type your answer before checking.", "bad");
+    ui.guess.focus();
+    return;
+  }
+
+  const correct = guess === expected;
+  if (correct) state.score += 1;
+
+  setFeedback(
+    correct ? "Hooray! That's correct." : `Oops! The word was "${item}".`,
+    correct ? "ok" : "bad"
+  );
+
+  setLocked(true);
+  ui.statScore.textContent = `Score: ${state.score}`;
+
+  const atLastQuestion = state.index === QUESTIONS_PER_ROUND - 1;
+  if (atLastQuestion) {
+    ui.nextBtn.textContent = "See my score";
+  } else {
+    ui.nextBtn.textContent = "Next picture";
+  }
+}
+
+function nextQuestion() {
+  if (!state.locked) return;
+  const atLastQuestion = state.index === QUESTIONS_PER_ROUND - 1;
+  if (atLastQuestion) {
+    finishGame();
+    return;
+  }
+  state.index += 1;
+  loadQuestion();
+}
+
+function restart() {
+  ui.nameInput.value = "";
+  ui.startError.textContent = "";
+  ui.progressBar.style.width = "0%";
+  showScreen(ui.start);
+  ui.nameInput.focus();
+}
+
+function wireEvents() {
+  ui.startBtn.addEventListener("click", startGame);
+  ui.restartBtn.addEventListener("click", restart);
+  ui.checkBtn.addEventListener("click", checkAnswer);
+  ui.nextBtn.addEventListener("click", nextQuestion);
+
+  ui.nameInput.addEventListener("keydown", (e) => {
+    if (e.key === "Enter") startGame();
+  });
+
+  ui.guess.addEventListener("keydown", (e) => {
+    if (e.key === "Enter") checkAnswer();
+  });
+}
+
+window.addEventListener("DOMContentLoaded", () => {
+  wireEvents();
+});
 
EOF
)
