"use strict";

// 1) ITEMS: key must match filename WITHOUT extension, including capitals/spaces.
// 2) Images must be in /images and be .png

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
const IMAGE_EXTENSION = ".png";
const QUESTIONS_PER_ROUND = 10;

const $ = (id) => document.getElementById(id);

const el = {
  start: $("screen-start"),
  game: $("screen-game"),
  end: $("screen-end"),
  name: $("name"),
  startErr: $("start-error"),
  btnStart: $("btn-start"),
  btnCheck: $("btn-check"),
  btnNext: $("btn-next"),
  btnRestart: $("btn-restart"),
  lblName: $("lbl-name"),
  lblProgress: $("lbl-progress"),
  lblScore: $("lbl-score"),
  img: $("img"),
  blanks: $("blanks"),
  answer: $("answer"),
  feedback: $("feedback"),
  endTitle: $("end-title"),
  endScore: $("end-score"),
};

function fail(msg) {
  el.startErr.textContent = msg;
  console.error(msg);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function norm(s) {
  return (s || "").trim().toLowerCase();
}

let player = "";
let round = [];
let idx = 0;
let score = 0;

function show(screen) {
  el.start.classList.add("hidden");
  el.game.classList.add("hidden");
  el.end.classList.add("hidden");
  screen.classList.remove("hidden");
}

function imgUrl(key) {
  // Encode spaces and special chars safely for URLs
  const filename = encodeURIComponent(key) + IMAGE_EXTENSION;
  return IMAGE_FOLDER + filename;
}

function setFeedback(text, ok) {
  el.feedback.textContent = text;
  el.feedback.classList.remove("ok", "bad");
  if (ok === true) el.feedback.classList.add("ok");
  if (ok === false) el.feedback.classList.add("bad");
}

function loadQ() {
  const item = round[idx];
  el.lblName.textContent = `Nimi: ${player}`;
  el.lblProgress.textContent = `Küsimus: ${idx + 1}/${QUESTIONS_PER_ROUND}`;
  el.lblScore.textContent = `Punktid: ${score}/${QUESTIONS_PER_ROUND}`;

  const clean = item.et.replace(/[\s-]/g, "");
  el.blanks.textContent = "_".repeat(clean.length);

  el.img.src = imgUrl(item.key);
  el.img.alt = item.et;

  el.answer.value = "";
  el.answer.disabled = false;
  el.btnCheck.disabled = false;
  el.btnNext.classList.add("hidden");
  setFeedback("", null);

  el.answer.focus();
}

function start() {
  el.startErr.textContent = "";

  if (!ITEMS.length) return fail("ITEMS on tühi.");
  player = el.name.value.trim() || "Sõber";
  score = 0;
  idx = 0;

  round = shuffle(ITEMS).slice(0, Math.min(QUESTIONS_PER_ROUND, ITEMS.length));
  show(el.game);
  loadQ();
}

function check() {
  const item = round[idx];
  const ok = norm(el.answer.value) === norm(item.et);

  if (ok) {
    score += 1;
    setFeedback("Õige!", true);
  } else {
    setFeedback(`Vale. Õige vastus on: "${item.et}".`, false);
  }

  el.answer.disabled = true;
  el.btnCheck.disabled = true;
  el.btnNext.classList.remove("hidden");
}

function next() {
  idx += 1;
  if (idx >= round.length) {
    el.endTitle.textContent = `Tubli töö, ${player}!`;
    el.endScore.textContent = `Sinu tulemus: ${score} / ${round.length}`;
    show(el.end);
    return;
  }
  loadQ();
}

function restart() {
  // keep same name; restart round
  score = 0;
  idx = 0;
  round = shuffle(ITEMS).slice(0, Math.min(QUESTIONS_PER_ROUND, ITEMS.length));
  show(el.game);
  loadQ();
}

// Wire up
el.btnStart.addEventListener("click", start);
el.btnCheck.addEventListener("click", check);
el.btnNext.addEventListener("click", next);
el.btnRestart.addEventListener("click", () => { show(el.start); });
el.answer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !el.btnCheck.disabled) check();
});

// Image load error visibility
el.img.addEventListener("error", () => {
  setFeedback(`Pilt ei laadinud: ${el.img.src}`, false);
});

