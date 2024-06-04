import URLSearchParams from 'url';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "textSelected") {
        const selectedText = message.text;
        console.log("Texto selecionado: ", selectedText);

        openLoadingPopup().then(loadingWindow => {
            generateQuestions(selectedText).then(questions => {
                console.log("questions: ", questions);
                chrome.runtime.sendMessage({ action: "showQuestions", questions: questions });
                closeLoadingPopupAndOpenQuestions(questions, loadingWindow.id);
            });
        }).catch(error => {
            console.error("Error opening loading popup: ", error);
        });
    }
});

async function generateQuestions(text) {
    const apiKey = 'AIzaSyC7cTMms4nwPwIusJJa32mJbcFyMWz9gwc';
    const modelId = 'gemini-pro';

    const url = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`;
    const params = {
        "contents": [
            {
                "parts": [{
                    "text": `Generate five multiple choice questions and their correct answers based on the following text: "${text}"

                    The output should only contain the questions and answers in the exact format shown below, with no additional text or explanations. 
                    
                    P1 First Question ? A) Option1 B) Option2 C) Option3 D) Option4 R1 Corretct Option
                    P2 Second Question ? A) Option1 B) Option2 C) Option3 D) Option4 R2 Corretct Option
                    P3 Third Question ? A) Option1 B) Option2 C) Option3 D) Option4 R3 Corretct Option
                    P4 Fourth Question ? A) Option1 B) Option2 C) Option3 D) Option4 R4 Corretct Option
                    P5 fifth Question ? A) Option1 B) Option2 C) Option3 D) Option4 R5 Corretct Option
                    
                    Each question should be followed by four options (A, B, C, D), and the correct answer should be indicated with the letter and the full text of the correct option. 
                    For exemple: P1 What is the color of the sky? A) Blue B) Yellow C) Green D) Red R1 A) Blue`
                }]
            }
        ]
    };

    const headers = {
        'Content-Type': 'application/json',
    };

    const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            const questions = data.candidates[0].content.parts[0].text;
            console.log(questions);
            return questions;
        } else {
            console.error('Error generating questions:', data.error);
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
    }

    return [];
}

function openLoadingPopup() {
    return new Promise((resolve, reject) => {
        chrome.windows.create({
            url: chrome.runtime.getURL('loading.html'),
            type: 'popup',
            width: 300,
            height: 200,
            left: 400,
            top: 200
        }, function (win) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(win);
            }
        });
    });
}

function closeLoadingPopupAndOpenQuestions(questions, loadingWindowId) {
    chrome.windows.remove(loadingWindowId, function () {
        openQuestionsPopup(questions);
    });
}

function openQuestionsPopup(questions) {
    const width = 400;
    const height = 600;
    const left = 200;
    const top = 200;

    const encodedQuestions = encodeURIComponent(questions);

    chrome.windows.create({
        url: chrome.runtime.getURL('questions.html') + '?questions=' + encodedQuestions,
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
    }, function (win) {});
}
