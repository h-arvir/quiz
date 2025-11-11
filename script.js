const quizzes = {
    aptitude: {
        title: 'Aptitude Trial',
        questions: [
            {
                prompt: 'A train 120m long crosses a man walking at 6km/h in opposite direction in 6 seconds. Speed of train?',
                options: ['60 km/h', '72 km/h', '54 km/h', '66 km/h'],
                answer: 1,
                marks: 10
            },
            {
                prompt: 'If 3 men or 4 women can finish a job in 12 days, how long will 6 men and 8 women take?',
                options: ['4 days', '5 days', '6 days', '7 days'],
                answer: 0,
                marks: 10
            },
            {
                prompt: 'The average of five numbers is 27. If one number is removed, average becomes 25. The removed number is?',
                options: ['27', '30', '35', '32'],
                answer: 3,
                marks: 10
            },
            {
                prompt: 'A shopkeeper allows 10% discount and still gains 20%. The marked price Rs.360 is?',
                options: ['Rs.300', 'Rs.320', 'Rs.350', 'Rs.400'],
                answer: 3,
                marks: 10
            },
            {
                prompt: 'If A can do a work in 10 days and B in 15 days, how long will they take together?',
                options: ['6 days', '7 days', '8 days', '9 days'],
                answer: 0,
                marks: 10
            },
            {
                prompt: 'The ratio of boys to girls in a class is 3:2. If there are 25 boys, how many girls?',
                options: ['15', '16', '17', '18'],
                answer: 2,
                marks: 10
            },
            {
                prompt: 'A sum becomes Rs.1352 in 2 years at 4% per annum. The principal amount is?',
                options: ['Rs.1200', 'Rs.1250', 'Rs.1300', 'Rs.1350'],
                answer: 1,
                marks: 10
            },
            {
                prompt: 'Find the odd one out: 2, 3, 5, 8, 13, 21',
                options: ['2', '8', '13', '21'],
                answer: 1,
                marks: 10
            },
            {
                prompt: 'A man buys a cycle for Rs.1400 and sells it for Rs.1550. His gain percent is?',
                options: ['10%', '10.5%', '11%', '11.5%'],
                answer: 0,
                marks: 10
            }
        ]
    },
    technical: {
        title: 'Technical Trial',
        questions: [
            {
                prompt: 'Which HTML tag is semantic for navigation links?',
                options: ['<nav>', '<section>', '<aside>', '<menu>'],
                answer: 0,
                marks: 10
            },
            {
                prompt: 'Time complexity of binary search on sorted array?',
                options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                answer: 1,
                marks: 10
            },
            {
                prompt: 'Which keyword prevents inheritance in Java?',
                options: ['static', 'const', 'final', 'sealed'],
                answer: 2,
                marks: 10
            },
            {
                prompt: 'Dockerfile instruction to execute commands in new layer during build?',
                options: ['ENTRYPOINT', 'RUN', 'CMD', 'EXEC'],
                answer: 1,
                marks: 10
            }
        ]
    },
    maths: {
        title: 'Maths Trial',
        questions: [
            {
                prompt: 'Solve: ∫ 2x dx from 0 to 3',
                options: ['9', '6', '18', '12'],
                answer: 0,
                marks: 10
            },
            {
                prompt: 'If sin θ = 3/5, cos θ in first quadrant is?',
                options: ['4/5', '5/4', '√(7)/6', '3/4'],
                answer: 0,
                marks: 10
            },
            {
                prompt: 'Determinant of [[2,3],[4,1]] equals?',
                options: ['-10', '10', '5', '-5'],
                answer: 0,
                marks: 10
            },
            {
                prompt: 'Sum of first 20 odd numbers?',
                options: ['200', '400', '800', '600'],
                answer: 1,
                marks: 10
            }
        ]
    }
};

const categoryScreen = document.getElementById('category-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const categoryButtons = document.querySelectorAll('.category-btn');
const optionsContainer = document.getElementById('options-container');
const questionText = document.getElementById('question-text');
const questionProgress = document.getElementById('question-progress');
const categoryLabel = document.getElementById('category-label');
const scoreboard = document.getElementById('scoreboard');
const nextBtn = document.getElementById('next-btn');
const quitBtn = document.getElementById('quit-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const resultTotal = document.getElementById('result-total');
const resultCorrect = document.getElementById('result-correct');
const resultMarks = document.getElementById('result-marks');

// Only add event listeners if elements exist
if (categoryButtons.length > 0) {
    categoryButtons.forEach((button) => {
        button.addEventListener('click', () => startQuiz(button.dataset.category));
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (!activeQuiz) return;
        if (!answered) return;

        questionIndex += 1;
        if (questionIndex >= activeQuiz.questions.length) {
            finishQuiz();
        } else {
            renderQuestion();
        }
    });
}

if (quitBtn) {
    quitBtn.addEventListener('click', returnHome);
}

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', returnHome);
}

let activeQuiz = null;
let questionIndex = 0;
let earnedMarks = 0;
let correctCount = 0;
let totalMarks = 0;
let answered = false;

const hide = (element) => element.classList.add('hidden');
const show = (element) => element.classList.remove('hidden');

function resetState() {
    questionIndex = 0;
    earnedMarks = 0;
    correctCount = 0;
    totalMarks = activeQuiz.questions.reduce((sum, q) => sum + q.marks, 0);
    scoreboard.textContent = `Marks: 0 / ${totalMarks}`;
    questionProgress.textContent = '';
    answered = false;
}

function renderQuestion() {
    const { questions, title } = activeQuiz;
    const current = questions[questionIndex];
    answered = false;
    categoryLabel.textContent = title;
    questionProgress.textContent = `Q ${questionIndex + 1} / ${questions.length}`;
    questionText.textContent = current.prompt;
    optionsContainer.innerHTML = '';
    nextBtn.disabled = true;
    nextBtn.textContent = questionIndex === questions.length - 1 ? 'Finish' : 'Next';

    current.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.tabIndex = 0;
        button.addEventListener('click', () => handleAnswer(button, index));
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(button, index) {
    if (answered) return;
    answered = true;
    const { questions } = activeQuiz;
    const current = questions[questionIndex];
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');

    optionButtons.forEach((btn, idx) => {
        if (idx === current.answer) {
            btn.classList.add('correct');
        }
        if (idx === index && idx !== current.answer) {
            btn.classList.add('incorrect');
        }
        btn.disabled = true;
    });

    if (index === current.answer) {
        correctCount += 1;
        earnedMarks += current.marks;
    }

    scoreboard.textContent = `Marks: ${earnedMarks} / ${totalMarks}`;
    nextBtn.disabled = false;
}

function startQuiz(category) {
    // Navigate to quiz page with category parameter
    window.location.href = `quiz.html?category=${category}`;
}

function finishQuiz() {
    // Navigate to results page with quiz results
    const params = new URLSearchParams({
        total: activeQuiz.questions.length,
        correct: correctCount,
        marks: earnedMarks,
        totalMarks: totalMarks
    });
    window.location.href = `results.html?${params.toString()}`;
}

function returnHome() {
    // Navigate back to home page
    window.location.href = 'index.html';
}



// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    // If on quiz page, initialize quiz with category from URL
    if (document.getElementById('quiz-screen')) {
        const category = urlParams.get('category');
        if (category && quizzes[category]) {
            activeQuiz = quizzes[category];
            resetState();
            renderQuestion();
        } else {
            // Invalid category, go back to home
            window.location.href = 'index.html';
        }
    }

    // If on results page, display results from URL parameters
    if (document.getElementById('result-screen')) {
        const total = urlParams.get('total');
        const correct = urlParams.get('correct');
        const marks = urlParams.get('marks');
        const totalMarksParam = urlParams.get('totalMarks');

        if (total && correct && marks && totalMarksParam) {
            resultTotal.textContent = total;
            resultCorrect.textContent = correct;
            resultMarks.textContent = `${marks} / ${totalMarksParam}`;
        } else {
            // Invalid results, go back to home
            window.location.href = 'index.html';
        }
    }
});
