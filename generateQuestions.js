const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

console.log('generateQuestions.js iniciado')

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "generateQuestions") {
        const selectedText = message.text;
        console.log("Texto selecionado aqui no generate.js: ", selectedText);
        // generateQuestions(selectedText).then(questions => {
        //     chrome.runtime.sendMessage({ action: "showQuestions", questions: questions });
        // });
    }
});


async function generateQuestions(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate five multiple choice questions based on the following text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = response.text();

    console.log(questions);

    openQuestionsPopup(questions);
    return questions;
}

function openQuestionsPopup(questions) {
    const screen = window.screen;
    const width = 400;
    const height = 600;

    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    chrome.windows.create({
        url: chrome.runtime.getURL('questions.html'),
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
    }, function(win) {
    });
}