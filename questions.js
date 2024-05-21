document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionsText = decodeURIComponent(urlParams.get('questions'));

    if (!questionsText) {
        console.error("No questions text found in URL parameters.");
        return;
    }

    const container = document.getElementById('questions-container');
    const messageContainer = document.getElementById('message-container');
    const questions = parseQuestions(questionsText);

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

    function parseQuestions(text) {
        const parts = text.match(/P\d+.*?R\d+ [A-D]\) .*?(?=P\d|$)/gs);
        return parts.map(part => {
            const title = part.match(/P\d+ (.*?) A\)/)[1];
            const options = part.match(/A\) (.*?) B\) (.*?) C\) (.*?) D\) (.*?)(?= R\d+)/);
            const correct = part.match(/R\d+ ([A-D]\) .*?)(?=\n|$)/)[1];
    
            return {
                title: title,
                options: options.slice(1).map((text, index) => ({
                    text: `${['A', 'B', 'C', 'D'][index]}) ${text}`,
                    isCorrect: `${['A', 'B', 'C', 'D'][index]}) ${text}`.trim() === correct.trim()
                })),
                correctAnswer: correct
            };
        });
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
