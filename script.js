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
        button.addEventListener('click', (e) => {
            playClickSound();
            if (button.dataset.category === 'ai') {
                // Navigate to AI input page
                const crtFrame = document.querySelector('.crt-frame');
                if (crtFrame) crtFrame.classList.add('fade-out');

                setTimeout(() => {
                    showLoading();
                    setTimeout(() => {
                        window.location.href = 'ai-input.html';
                    }, 200);
                }, 300);
            } else {
                startQuiz(button.dataset.category);
            }
        });
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (!activeQuiz) return;
        if (!answered) return;

        playClickSound();
        questionIndex += 1;
        if (questionIndex >= activeQuiz.questions.length) {
            finishQuiz();
        } else {
            renderQuestion();
        }
    });
}

if (quitBtn) {
    quitBtn.addEventListener('click', () => {
        playClickSound();
        returnHome();
    });
}

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
        playClickSound();
        returnHome();
    });
}

// AI input screen event listeners
const generateAIQuizBtn = document.getElementById('generate-ai-quiz');
const backToCategoriesBtn = document.getElementById('back-to-categories');
const aiTopicInput = document.getElementById('ai-topic-input');

if (generateAIQuizBtn) {
    generateAIQuizBtn.addEventListener('click', () => {
        playClickSound();
        generateAIQuiz();
    });
}

if (backToCategoriesBtn) {
    backToCategoriesBtn.addEventListener('click', () => {
        playClickSound();
        returnHome();
    });
}

let activeQuiz = null;
let questionIndex = 0;
let earnedMarks = 0;
let correctCount = 0;
let totalMarks = 0;
let answered = false;

const hide = (element) => element.classList.add('hidden');
const show = (element) => element.classList.remove('hidden');

const showLoading = () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('show');
};

const hideLoading = () => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('show');
};

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(frequency = 800, duration = 200, type = 'square') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

function playCorrectSound() {
    // Happy ascending notes
    setTimeout(() => playBeep(523, 150, 'sine'), 0);   // C5
    setTimeout(() => playBeep(659, 150, 'sine'), 100); // E5
    setTimeout(() => playBeep(784, 200, 'sine'), 200); // G5
}

function playIncorrectSound() {
    // Sad descending notes
    setTimeout(() => playBeep(392, 200, 'sawtooth'), 0);  // G4
    setTimeout(() => playBeep(330, 200, 'sawtooth'), 150); // E4
}

function playClickSound() {
    playBeep(600, 100, 'square');
}

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

    // Update progress bar
    const progressPercent = ((questionIndex + 1) / questions.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }

    questionText.textContent = current.prompt;
    optionsContainer.innerHTML = '';
    nextBtn.disabled = true;
    nextBtn.textContent = questionIndex === questions.length - 1 ? 'Finish' : 'Next';

    current.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.tabIndex = 0;
        button.addEventListener('click', () => {
            playClickSound();
            handleAnswer(button, index);
        });
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
        playCorrectSound();
    } else {
        playIncorrectSound();
    }

    scoreboard.textContent = `Marks: ${earnedMarks} / ${totalMarks}`;
    nextBtn.disabled = false;
}

function startQuiz(category) {
    // Add fade-out transition and navigate to quiz page
    const crtFrame = document.querySelector('.crt-frame');
    if (crtFrame) crtFrame.classList.add('fade-out');

    setTimeout(() => {
        showLoading();
        setTimeout(() => {
            window.location.href = `quiz.html?category=${category}`;
        }, 200);
    }, 300);
}

function finishQuiz() {
    // Add fade-out transition and navigate to results page
    const crtFrame = document.querySelector('.crt-frame');
    if (crtFrame) crtFrame.classList.add('fade-out');

    setTimeout(() => {
        showLoading();
        setTimeout(() => {
            const params = new URLSearchParams({
                total: activeQuiz.questions.length,
                correct: correctCount,
                marks: earnedMarks,
                totalMarks: totalMarks
            });
            window.location.href = `results.html?${params.toString()}`;
        }, 200);
    }, 300);
}

function returnHome() {
    // Add fade-out transition and navigate back to home page
    const crtFrame = document.querySelector('.crt-frame');
    if (crtFrame) crtFrame.classList.add('fade-out');

    setTimeout(() => {
        showLoading();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 200);
    }, 300);
}



async function generateAIQuiz() {
    const topic = aiTopicInput.value.trim();
    if (!topic) {
        alert('Please enter a topic for the quiz.');
        return;
    }

    showLoading();

    try {
        // Call Gemini 2.0 Flash API to generate quiz
        const response = await callGeminiAPI(topic);

        // Create quiz object from API response
        const aiQuiz = {
            title: `${topic} Quiz`,
            questions: response.questions.map(q => ({
                prompt: q.question,
                options: q.options,
                answer: q.correctAnswer,
                marks: 10
            }))
        };

        // Store the AI quiz temporarily and start the quiz
        quizzes.ai = aiQuiz;
        startQuiz('ai');

    } catch (error) {
        console.error('Error generating AI quiz:', error);

        // Handle rate limiting with fallback
        if (error.message.includes('quota') || error.message.includes('429') || error.message.includes('Too Many Requests')) {
            alert('AI quiz generation is currently rate limited. Using sample questions instead.');
            // Fallback to mock questions
            const mockResponse = await generateMockQuiz(topic);

            const aiQuiz = {
                title: `${topic} Quiz (Sample)`,
                questions: mockResponse.questions.map(q => ({
                    prompt: q.question,
                    options: q.options,
                    answer: q.correctAnswer,
                    marks: 10
                }))
            };

            quizzes.ai = aiQuiz;
            startQuiz('ai');
            return;
        }

        alert('Failed to generate quiz. Please try again.');
        hideLoading();
    }
}

// Function to call Gemini 2.0 Flash API
async function callGeminiAPI(topic) {
    // Replace 'YOUR_GEMINI_API_KEY' with your actual API key from Google AI Studio
    const API_KEY = 'AIzaSyAwqu5p-W2M08gG2THHabej2v5n0YC0pcc';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

    const prompt = `Create 10 multiple-choice questions about "${topic}". Each needs 4 options, 1 correct answer.

JSON: [{"question": "Q?", "options": ["A", "B", "C", "D"], "correctAnswer": 0}]

Educational and accurate only.`;

    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        }
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    try {
        // Try to parse the JSON response
        const questions = JSON.parse(generatedText.trim());

        // Validate the response structure
        if (!Array.isArray(questions) || questions.length !== 10) {
            throw new Error('Invalid quiz format: expected 10 questions');
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                throw new Error(`Invalid question ${i + 1} format`);
            }
        }

        return { questions };
    } catch (parseError) {
        console.error('Failed to parse Gemini response:', generatedText);
        throw new Error('Failed to parse quiz data from AI response');
    }
}

// Fallback function to generate mock quiz when API is rate limited
async function generateMockQuiz(topic) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate sample questions based on topic
    const sampleQuestions = {
        'javascript': [
            {
                question: 'What is the correct way to declare a variable in JavaScript?',
                options: ['var myVar;', 'variable myVar;', 'v myVar;', 'declare myVar;'],
                correctAnswer: 0
            },
            {
                question: 'Which method adds an element to the end of an array?',
                options: ['push()', 'add()', 'append()', 'insert()'],
                correctAnswer: 0
            },
            {
                question: 'What does "===" mean in JavaScript?',
                options: ['Equal value only', 'Equal value and type', 'Not equal', 'Greater than'],
                correctAnswer: 1
            },
            {
                question: 'Which keyword is used to define a function?',
                options: ['def', 'function', 'fun', 'define'],
                correctAnswer: 1
            },
            {
                question: 'What is the DOM in JavaScript?',
                options: ['Data Object Model', 'Document Object Model', 'Dynamic Object Model', 'Display Object Model'],
                correctAnswer: 1
            },
            {
                question: 'Which symbol is used for comments in JavaScript?',
                options: ['//', '/* */', '#', '<!-- -->'],
                correctAnswer: 0
            },
            {
                question: 'What does JSON stand for?',
                options: ['JavaScript Object Notation', 'JavaScript Online Network', 'JavaScript Object Network', 'Java Simple Object Notation'],
                correctAnswer: 0
            },
            {
                question: 'Which loop executes at least once?',
                options: ['for', 'while', 'do-while', 'foreach'],
                correctAnswer: 2
            },
            {
                question: 'What is the purpose of the "this" keyword?',
                options: ['Refers to the current object', 'Refers to the parent object', 'Refers to global object', 'Refers to null'],
                correctAnswer: 0
            },
            {
                question: 'Which method converts a string to uppercase?',
                options: ['toUpper()', 'upperCase()', 'toUpperCase()', 'makeUpper()'],
                correctAnswer: 2
            }
        ],
        'python': [
            {
                question: 'What is the correct file extension for Python files?',
                options: ['.py', '.python', '.pt', '.pyt'],
                correctAnswer: 0
            },
            {
                question: 'Which keyword is used to define a function in Python?',
                options: ['def', 'function', 'fun', 'define'],
                correctAnswer: 0
            },
            {
                question: 'What does "len()" function do?',
                options: ['Returns length of string/list', 'Returns type', 'Returns sum', 'Returns max value'],
                correctAnswer: 0
            },
            {
                question: 'Which data type is immutable in Python?',
                options: ['list', 'dict', 'tuple', 'set'],
                correctAnswer: 2
            },
            {
                question: 'What is the output of print(2**3)?',
                options: ['6', '8', '9', '23'],
                correctAnswer: 1
            },
            {
                question: 'Which symbol is used for comments in Python?',
                options: ['//', '#', '/* */', '<!-- -->'],
                correctAnswer: 1
            },
            {
                question: 'What does "import" statement do?',
                options: ['Exports module', 'Imports module', 'Deletes module', 'Renames module'],
                correctAnswer: 1
            },
            {
                question: 'Which method adds item to end of list?',
                options: ['add()', 'append()', 'insert()', 'push()'],
                correctAnswer: 1
            },
            {
                question: 'What is the result of "Hello" + "World"?',
                options: ['HelloWorld', 'Hello World', 'Error', 'None'],
                correctAnswer: 0
            },
            {
                question: 'Which loop is used when number of iterations is known?',
                options: ['while', 'for', 'do-while', 'foreach'],
                correctAnswer: 1
            }
        ],
        'default': [
            {
                question: `What is the capital of France?`,
                options: ['London', 'Berlin', 'Paris', 'Madrid'],
                correctAnswer: 2
            },
            {
                question: `Which planet is known as the Red Planet?`,
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                correctAnswer: 1
            },
            {
                question: `What is 2 + 2 × 3?`,
                options: ['8', '12', '6', '10'],
                correctAnswer: 0
            },
            {
                question: `Who painted the Mona Lisa?`,
                options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Michelangelo'],
                correctAnswer: 2
            },
            {
                question: `What is the largest ocean on Earth?`,
                options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
                correctAnswer: 3
            },
            {
                question: `Which element has the chemical symbol 'O'?`,
                options: ['Gold', 'Oxygen', 'Silver', 'Iron'],
                correctAnswer: 1
            },
            {
                question: `What year did World War II end?`,
                options: ['1944', '1945', '1946', '1947'],
                correctAnswer: 1
            },
            {
                question: `Which programming language was created by Guido van Rossum?`,
                options: ['Java', 'C++', 'Python', 'JavaScript'],
                correctAnswer: 2
            },
            {
                question: `What is the square root of 144?`,
                options: ['10', '11', '12', '13'],
                correctAnswer: 2
            },
            {
                question: `Which country is known as the Land of the Rising Sun?`,
                options: ['China', 'Japan', 'Thailand', 'South Korea'],
                correctAnswer: 1
            }
        ]
    };

    // Get questions based on topic (case insensitive)
    const topicLower = topic.toLowerCase();
    let questions;

    if (topicLower.includes('javascript') || topicLower.includes('js')) {
        questions = sampleQuestions.javascript;
    } else if (topicLower.includes('python')) {
        questions = sampleQuestions.python;
    } else {
        questions = sampleQuestions.default;
    }

    return { questions };
}



// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading overlay and add fade-in effect on page load
    hideLoading();
    const crtFrame = document.querySelector('.crt-frame');
    if (crtFrame) crtFrame.classList.add('fade-in');

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
