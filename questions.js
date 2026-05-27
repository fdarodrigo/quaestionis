document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionsText = decodeURIComponent(urlParams.get('questions'));

    if (!questionsText) {
        console.error("No questions text found in URL parameters.");
        return;
    }

    const container = document.getElementById('questions-container');
    const messageContainer = document.getElementById('message-container');
    const error = parseError(questionsText);
    if (error) {
        renderError(error);
        return;
    }

    const questions = parseQuestions(questionsText);
    if (!questions.length) {
        renderError("Could not read the generated questions. Check the extension service worker logs for the Gemini response.");
        return;
    }

    questions.forEach(question => {
        const questionEl = document.createElement('div');
        questionEl.className = 'question';

        const title = document.createElement('div');
        title.className = 'question-title';
        title.textContent = question.title;
        questionEl.appendChild(title);

        question.options.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.textContent = option.text;
            optionEl.onclick = () => checkAnswer(option, optionEl);
            questionEl.appendChild(optionEl);
        });

        container.appendChild(questionEl);
    });

    function parseError(text) {
        try {
            const value = JSON.parse(text);
            return value && value.error;
        } catch (error) {
            return null;
        }
    }

    function renderError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'question';
        errorEl.textContent = message;
        container.appendChild(errorEl);
    }

    function parseQuestions(text) {
        const parts = text.match(/P\d+.*?R\d+ [A-D]\) .*?(?=P\d|$)/gs);
        if (!parts) {
            return [];
        }

        return parts.map(part => {
            const titleMatch = part.match(/P\d+ (.*?) A\)/);
            const options = part.match(/A\) (.*?) B\) (.*?) C\) (.*?) D\) (.*?)(?= R\d+)/);
            const correctMatch = part.match(/R\d+ ([A-D]\) .*?)(?=\n|$)/);
            if (!titleMatch || !options || !correctMatch) {
                return null;
            }

            const title = titleMatch[1];
            const correct = correctMatch[1];
    
            return {
                title: title,
                options: options.slice(1).map((text, index) => ({
                    text: `${['A', 'B', 'C', 'D'][index]}) ${text}`,
                    isCorrect: `${['A', 'B', 'C', 'D'][index]}) ${text}`.trim() === correct.trim()
                })),
                correctAnswer: correct
            };
        }).filter(Boolean);
    }
    
    

    function checkAnswer(option, optionEl) {
        if (option.isCorrect) {
            optionEl.style.backgroundColor = 'lightgreen';
            optionEl.classList.add('blink');
        } else {
            optionEl.style.backgroundColor = 'salmon';
            optionEl.classList.add('vibrate');
        }

        optionEl.addEventListener('animationend', () => {
            optionEl.classList.remove('blink');
            optionEl.classList.remove('vibrate');
        });
    }
});
