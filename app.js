// ===== QUIZ DATA =====
// Array of question objects
const questions = [
  {
    question: "Which HTML tag is used for the largest heading?",
    options: ["h1", "h6", "header", "head"],
    correct: 0
  },
  {
    question: "Which CSS property changes the text color?",
    options: ["font-color", "color", "text-style", "text-color"],
    correct: 1
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["//", "/* */", "<!-- -->", "#"],
    correct: 0
  },
  {
    question: "Which method is used to access HTML elements by ID in JS?",
    options: ["getElementByName()", "getElementById()", "querySelectorAll()", "getElements()"],
    correct: 1
  },
  {
    question: "What does CSS stand for?",
    options: ["Colorful Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Creative Style System"],
    correct: 2
  }
];

// ===== VARIABLES =====
let currentQ = 0;               // Current question index
let selected = new Array(questions.length).fill(null);  // Stores user answers
let timeLeft = 120;             // 2 minutes total time

// ===== DOM ELEMENTS =====
const quizBox = document.getElementById('quiz-box');
const resultBox = document.getElementById('result-box');
const quiz = document.getElementById('quiz');
const timerDisplay = document.getElementById('time');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const resultDisplay = document.getElementById('result');

// ===== DISPLAY QUESTION FUNCTION =====
function showQuestion(index) {
  const q = questions[index];  // Get question
  quiz.innerHTML = `
    <div class="question">${index + 1}. ${q.question}</div>
    <div class="options">
      ${q.options.map((opt, i) => `
        <div class="option ${selected[index] === i ? 'selected' : ''}" onclick="selectOption(${i})">${opt}</div>
      `).join('')}
    </div>
  `;

  // Manage button state
  prevBtn.disabled = index === 0;
  nextBtn.textContent = (index === questions.length - 1) ? "Finish" : "Next";
}

// ===== OPTION SELECTION =====
function selectOption(i) {
  selected[currentQ] = i;   // Save selected answer
  showQuestion(currentQ);   // Refresh UI
}

// ===== BUTTON HANDLERS =====
nextBtn.addEventListener('click', () => {
  if (currentQ < questions.length - 1) {
    currentQ++;
    showQuestion(currentQ);
  } else {
    finishQuiz();  // End quiz
  }
});
prevBtn.addEventListener('click', () => {
  if (currentQ > 0) {
    currentQ--;
    showQuestion(currentQ);
  }
});

// ===== TIMER FUNCTION =====
function updateTimer() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  if (timeLeft <= 0) {
    finishQuiz(); // Auto-submit
  } else {
    timeLeft--;
  }
}
const timer = setInterval(updateTimer, 1000);  // Run timer every second

// ===== QUIZ FINISH FUNCTION =====
function finishQuiz() {
  clearInterval(timer); // Stop timer
  quizBox.style.display = 'none';
  resultBox.style.display = 'block';
  calculateScore();
}

// ===== SCORE CALCULATION FUNCTION =====
function calculateScore() {
  let correctCount = 0, wrongCount = 0;

  // Count correct and wrong answers
  questions.forEach((q, i) => {
    if (selected[i] === q.correct) correctCount++;
    else wrongCount++;
  });

  // Show results
  resultDisplay.innerHTML = `
    <h2>Your Score: ${correctCount} / ${questions.length}</h2>
    <p class="correct">✅ Correct: ${correctCount}</p>
    <p class="wrong">❌ Wrong: ${wrongCount}</p>
  `;

  // Draw result chart
  new Chart(document.getElementById("resultChart"), {
    type: 'doughnut',
    data: {
      labels: ['Correct', 'Wrong'],
      datasets: [{
        data: [correctCount, wrongCount],
        backgroundColor: ['#00e676', '#ff5252']
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } }
      }
    }
  });
}

// ===== START QUIZ =====
showQuestion(currentQ);
