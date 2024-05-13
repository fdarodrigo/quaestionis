import URLSearchParams from 'url';

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "textSelected") {
        const selectedText = message.text;
        console.log("Texto selecionado: ", selectedText);

        generateQuestionsMock(selectedText).then(questions => {

            console.log("questions: ", questions);
            chrome.runtime.sendMessage({ action: "showQuestions", questions: questions });
        });
    }
});

async function generateQuestions(text) {
    const apiKey = 'AIzaSyC7cTMms4nwPwIusJJa32mJbcFyMWz9gwc';
    const modelId = 'gemini-pro';
    const prompt = `Generate five multiple choice questions based on the following text: "${text}"`;
  
    const url = `https://generativelanguage.googleapis.com/v1/models/${modelId}:generateContent?key=${apiKey}`;
    const params = { "contents":[
        { "parts":[{"text": "Write a story about a magic backpack with 10 words"}]}
      ]
    } 
  
    const headers = {
    //   'Authorization': `Bearer ${apiKey}`,
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
        // openQuestionsPopup(questions);
        return questions;
      } else {
        console.error('Error generating questions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  
    return []; 
  }

  async function generateQuestionsMock(text) {
    const questions = " P1 Qual a cor do cavalo branco? A) Branco B) Cinza C) Azul D) Preto R1 Branco P2 Qual a cor do céu? A) Branco B) Cinza C) Azul D) Preto R2 Azul P3 Qual o animal que come com o rabo? A) Cachorro B) Gato C) Cavalo D) Peixe R3 Cavalo P4 Qual o oposto de quente? A) Frio B) Quente C) Morno D) Tépido R4 Frio P5 Qual o maior planeta do Sistema Solar? A) Terra B) Marte C) Júpiter D) Saturno R5 Júpiter "
        openQuestionsPopup(questions);
        return questions;
  }


  function openQuestionsPopup(questions) {
    const width = 400;  // Largura da janela popup
    const height = 600; // Altura da janela popup
    const left = 200;
    const top = 200;

    // Codifica as perguntas para serem passadas como parte da URL
    const encodedQuestions = encodeURIComponent(questions);

    chrome.windows.create({
        url: chrome.runtime.getURL('questions.html') + '?questions=' + encodedQuestions,
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
    }, function(win) {
        // Você pode guardar a janela criada se precisar manipulá-la depois
    });
}






