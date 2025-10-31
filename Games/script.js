import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, update, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9eMKtZz8dFK-Rx9hnefAuJP45DYdqRIo",
  authDomain: "duck-race-7b367.firebaseapp.com",
  databaseURL: "https://duck-race-7b367-default-rtdb.firebaseio.com",
  projectId: "duck-race-7b367",
  storageBucket: "duck-race-7b367.firebasestorage.app",
  messagingSenderId: "144768861061",
  appId: "1:144768861061:web:6c84e0479b73fc79effaec",
  measurementId: "G-3S5QHCVE5H"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const joinScreen = document.getElementById("join-screen");
const gameScreen = document.getElementById("game-screen");
const joinBtn = document.getElementById("joinBtn");
const playerNameInput = document.getElementById("playerName");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitAnswerBtn = document.getElementById("submitAnswer");
const winnerEl = document.getElementById("winner");

let playerName, category, playerPath;
let position = 0;
const finishLine = 80; // percent

// Mock questions per category
const trivia = {
  dinosaurs: [
    { q: "Largest carnivorous dinosaur?", a: "spinosaurus" },
    { q: "Flying reptile (not dinosaur)?", a: "pterosaur" }
  ],
  countries: [
    { q: "Capital of France?", a: "paris" },
    { q: "Country known for sushi?", a: "japan" }
  ],
  brands: [
    { q: "Logo with bitten apple?", a: "apple" },
    { q: "Three stripes logo?", a: "adidas" }
  ],
  persons: [
    { q: "Creator of Facebook?", a: "mark zuckerberg" },
    { q: "Singer of 'Hello'?", a: "adele" }
  ],
  cars: [
    { q: "Logo with 3-pointed star?", a: "mercedes" },
    { q: "Prancing horse logo?", a: "ferrari" }
  ]
};

let currentQuestion;

// join game
joinBtn.onclick = () => {
  playerName = playerNameInput.value.trim();
  category = document.getElementById("category").value;

  if (!playerName) return alert("Enter your name!");

  joinScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  playerPath = ref(db, "race/players/" + playerName);
  set(playerPath, { position: 0 });

  startGame();
};

// Start trivia game
function startGame() {
  nextQuestion();

  submitAnswerBtn.onclick = () => {
    const answer = answerInput.value.trim().toLowerCase();
    if (answer === currentQuestion.a) {
      position += 10;
      update(playerPath, { position });
      moveDuck(playerName, position);
      nextQuestion();
    } else {
      alert("❌ Wrong! Try again.");
    }
    answerInput.value = "";
  };

  // Real-time updates
  onValue(ref(db, "race/players"), (snapshot) => {
    const players = snapshot.val() || {};
    updateRace(players);
  });
}

// Display random question
function nextQuestion() {
  const list = trivia[category];
  currentQuestion = list[Math.floor(Math.random() * list.length)];
  questionEl.textContent = currentQuestion.q;
}

// Move ducks visually
function moveDuck(name, pos) {
  const duck = name === playerName ? document.getElementById("duck1") : document.getElementById("duck2");
  duck.style.left = pos + "%";
  if (pos >= finishLine) winnerEl.textContent = `🏆 ${name} wins the race!`;
}

function updateRace(players) {
  const names = Object.keys(players);
  names.forEach((n, i) => {
    const pos = players[n].position;
    const duck = document.getElementById("duck" + (i + 1));
    if (duck) duck.style.left = pos + "%";
    if (pos >= finishLine) winnerEl.textContent = `🏆 ${n} wins the race!`;
  });
}


