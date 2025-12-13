"use strict";

// Filenames: key must match filename WITHOUT extension, including capitals/spaces.
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

document.addEventListener("DOMContentLoaded", () => {
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
    letters: $("letters"),
    feedback: $("feedback"),
    endTitle: $("end-title"),
    endScore: $("end-score"),
  };

  // Hard-fail early if markup mismatched
  for (const [k, v] of Object.entries(el)) {
    if (!v) {
      console.error(`Missing element: ${k}`);
      return;
    }
  }

  function show(screen) {
    el.start.classList.add("hidden");
    el.game.classList.add("hidden");
    el.end.classList.add("hidden");
    screen.classList.remove("hidden");
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

  function imgUrl(key) {
    // Encodes spaces and special chars; keeps folder slash intact
    return IMAGE_FOLDER + encodeURIComponent(key) + IMAGE_EXTENSION;
  }

  function setFeedback(text, ok) {
    el.feedback.textContent = text;
    el.feedback.classList.remove("ok", "bad");
    if (ok === true) el.feedback.classList.add("ok");
    if (ok === false) el.feedback.classList.add("bad");
  }

  function setStartError(text) {
    el.startErr.textContent = text || "";
  }

  // Build per-letter inputs (supports Estonian letters)
  function buildLetterInputs(word) {
    el.letters.innerHTML = "";

    const chars = Array.from(word); // handles õ/ä/ö/ü correctly
    for (let i = 0; i < chars.length; i++) {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.inputMode = "text";
      inp.autocomplete = "off";
      inp.spellcheck = false;
      inp.maxLength = 1;
      inp.className = "letter";
      inp.setAttribute("aria-label", `Täht ${i + 1}`);
      el.letters.appendChild(inp);

      inp.addEventListener("input", () => {
        // keep only 1 char, auto-advance
        inp.value = Array.from(inp.value).slice(0, 1).join("");
        if (inp.value && i < chars.length - 1) {
          el.letters.children[i + 1].focus();
        }
      });

      inp.addEventListener("keydown", (e) => {
        // backspace moves left if empty
        if (e.key === "Backspace" && !inp.value && i > 0) {
          el.letters.children[i - 1].focus();
        }
        // enter = check
        if (e.key === "Enter") check();
      });
    }

    // focus first
    if (el.letters.firstChild) el.letters.firstChild.focus();
  }

  function readLetterInputs() {
    const inputs = [...el.letters.querySelectorAll("input.letter")];
    return inputs.map(i => i.value).join("");
  }

  function lockInputs(lock) {
    const inputs = [...el.letters.querySelectorAll("input.letter")];
    for (const i of inputs) i.disabled = lock;
    el.btnCheck.disabled = lock;
  }

  // State
  let player = "";
  let round = [];
  let idx = 0;
  let score = 0;

  function loadQ() {
    const item = round[idx];

    el.lblName.textContent = `Nimi: ${player}`;
    el.lblProgress.textContent = `Küsimus: ${idx + 1}/${round.length}`;
    el.lblScore.textContent = `Punktid: ${score}/${round.length}`;

    // blanks shown as underscores
    el.blanks.textContent = "_".repeat(Array.from(item.et.replace(/[\
