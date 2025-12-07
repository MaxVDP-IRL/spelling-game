// --- CONFIG: image list and translations ---
// key = filename WITHOUT extension, exactly as in your folder
// et  = correct Estonian word

const ITEMS = [
  { key: "Apple", et: "õun" },
  { key: "Artichoke", et: "artišokk" },
  { key: "Asparagus", et: "spargel" },
  { key: "Aubergine", et: "baklažaan" },
  { key: "Avacado", et: "avokaado" },
  { key: "Banana", et: "banaan" },
  { key: "Bear", et: "karu" },
  { key: "Blueberries", et: "mustikad" },
  { key: "Book", et: "raamat" },
  { key: "Broccoli", et: "brokoli" },
  { key: "Carrot", et: "porgand" },
  { key: "Cat", et: "kass" },
  { key: "Cauliflower", et: "lillkapsas" },
  { key: "Celery", et: "seller" },
  { key: "Chair", et: "tool" },
  { key: "Cherries", et: "kirsid" },
  { key: "Clock", et: "kell" },
  { key: "Coconut", et: "kookospähkel" },
  { key: "Comb", et: "kamm" },
  { key: "Corn", et: "mais" },
  { key: "Courgette", et: "suvikõrvits" },
  { key: "Cucumber", et: "kurk" },
  { key: "Cup", et: "tass" },
  { key: "Deer", et: "hirv" },
  { key: "Dog", et: "koer" },
  { key: "Dragonfruit", et: "draakonivili" },
  { key: "Duck", et: "part" },
  { key: "Elephant", et: "elevant" },
  { key: "Fish", et: "kala" },
  { key: "Fork", et: "kahvel" },
  { key: "Fox", et: "rebane" },
  { key: "Frog", et: "konn" },
  { key: "Garlic", et: "küüslauk" },
  { key: "Giraffe", et: "kaelkirjak" },
  { key: "Glasses", et: "prillid" },
  { key: "Grapes", et: "viinamarjad" },
  { key: "Horse", et: "hobune" },
  { key: "Kiwi", et: "kiivi" },
  { key: "Lemon", et: "sidrun" },
  { key: "Lettuce", et: "lehtsalat" },
  { key: "Lime", et: "laim" },
  { key: "Lion", et: "lõvi" },
  { key: "Mango", et: "mango" },
  { key: "Monkey", et: "ahv" },
  { key: "Mouse", et: "hiir" },
  { key: "Mushroom", et: "seen" },
  { key: "Onion", et: "sibul" },
  { key: "Orange", et: "apelsin" },
  { key: "Owl", et: "öökull" },
  { key: "Panda", et: "panda" },
  { key: "Peach", et: "virsik" },
  { key: "Pear", et: "pirn" },
  { key: "Peas", et: "herned" },
  { key: "Pencil", et: "pliiats" },
  { key: "Penguin", et: "pingviin" },
  { key: "Pepper", et: "paprika" },
  { key: "Pineapple", et: "ananass" },
  { key: "Plant", et: "taim" },
  { key: "Pomegranate", et: "granaatõun" },
  { key: "Potato", et: "kartul" },
  { key: "Pumpkin", et: "kõrvits" },
  { key: "Rabbit", et: "jänes" },
  { key: "Raspberry", et: "vaarikas" },
  { key: "Remote", et: "pult" },
  { key: "Rubberduck", et: "kummipart" },
  { key: "Spinach", et: "spinat" },
  { key: "Spoon", et: "lusikas" },
  { key: "Strawberry", et: "maasikas" },
  { key: "Tiger", et: "tiiger" },
  { key: "Toilet paper", et: "tualettpaber" },
  { key: "Tomato", et: "tomat" },
  { key: "Toothbrush", et: "hambahari" },
  { key: "Towel", et: "rätik" },
  { key: "Watermelon", et: "arbuus" },
];

const IMAGE_FOLDER = "images/";
const IMAGE_EXTENSION = ".png"; // as in your screenshot

// --- GAME STATE ---
let playerName = "";
let currentRoundItems = [];
let currentIndex = 0;      // 0..9
let score = 0;
const QUESTIONS_PER_ROUND = 10;

// --- DOM ELEMENTS ---
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const playerNameInput = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");

const playerLabel = document.getElementById("player-label");
const progressLabel = document.getElementById("progress-label");
const scoreLabel = document.getElementById("score-label");

const itemImage = document.getElementById("item-image");
const blankDisplay = document.getElementById("blank-display");
const answerInput = document.getElementById("answer-input");

const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const feedback = document.getElementById("feedback");

const endMessage = document.getElementById("end-message");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

// --- UTILITIES ---

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeAnswer(str) {
  return str.trim().toLowerCase();
}

// --- GAME FLOW ---

function startGame() {
  playerName = playerNameInput.value.trim() || "Sõber";

  score = 0;
  currentIndex = 0;

  const shuffled = shuffleArray(ITEMS);
  currentRoundItems = shuffled.slice(0, QUESTIONS_PER_ROUND);

  playerLabel.textContent = `Nimi: ${playerName}`;
  scoreLabel.textContent = `Punktid: 0/${QUESTIONS_PER_ROUND}`;

  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  loadCurrentQuestion();
}

function loadCurrentQuestion() {
  const item = currentRoundItems[currentIndex];
  const imagePath = IMAGE_FOLDER + item.key + IMAGE_EXTENSION;

  itemImage.src = imagePath;
  itemImage.alt = item.et;

  progressLabel.textContent = `Küsimus: ${currentIndex + 1}/${QUESTIONS_PER_ROUND}`;
  scoreLabel.textContent = `Punktid: ${score}/${QUESTIONS_PER_ROUND}`;

  const cleanWord = item.et.replace(/\s|-/g, "");
  blankDisplay.textContent = "_".repeat(cleanWord.length);

  feedback.textContent = "";
  feedback.classList.remove("correct", "incorrect");

  answerInput.value = "";
  answerInput.disabled = false;

  submitBtn.disabled = false;
  nextBtn.classList.add("hidden");

  answerInput.focus();
}

function checkAnswer() {
  const item = currentRoundItems[currentIndex];
  const correct = normalizeAnswer(item.et);
  const given = normalizeAnswer(answerInput.value);

  const isCorrect = given === correct;

  if (isCorrect) {
    score++;
    feedback.textContent = "Õige!";
    feedback.classList.remove("incorrect");
    feedback.classList.add("correct");
  } else {
    feedback.textContent = `Vale. Õige vastus on: "${item.et}".`;
    feedback.classList.remove("correct");
    feedback.classList.add("incorrect");
  }

  scoreLabel.textContent = `Punktid: ${score}/${QUESTIONS_PER_ROUND}`;

  answerInput.disabled = true;
  submitBtn.disabled = true;
  nextBtn.classList.remove("hidden");
}

function goToNextQuestion() {
  currentIndex++;
  if (currentIndex >= QUESTIONS_PER_ROUND) {
    endGame();
  } else {
    loadCurrentQuestion();
  }
}

function endGame() {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  endMessage.textContent = `Tubli töö, ${playerName}!`;
  finalScore.textContent = `Sinu tulemus: ${score} / ${QUESTIONS_PER_ROUND}`;
}

// --- EVENT LISTENERS ---

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", goToNextQuestion);
restartBtn.addEventListener("click", () => {
  startGame();
});

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !submitBtn.disabled) {
    checkAnswer();
  }
});
