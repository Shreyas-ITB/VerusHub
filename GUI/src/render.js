const preloader = document.querySelector(".preloader");
const preloaderDuration = 5000;
const getsentences = require('../libs/sentences.js');

const hidePreloader = () => {
    setTimeout(() => {
        preloader.classList.add("hide");
    }, preloaderDuration);
}

// Function to generate a random sentence
function getRandomSentence() {
    var index;
    var lastSentenceIndex = sessionStorage.getItem('lastSentenceIndex');
    const sentences = getsentences();
    do {
        index = Math.floor(Math.random() * sentences.length);
    } while (index === parseInt(lastSentenceIndex));
    
    sessionStorage.setItem('lastSentenceIndex', index);
    return sentences[index];
}

// Display a random sentence on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('sentence').textContent = getRandomSentence();
});

window.addEventListener("load", hidePreloader);

// const chatbot = require('../../test.js');

// const inputField = document.getElementById('supportinput');
// inputField.addEventListener('keypress', function(event) {
//     if (event.key === 'Enter') {
//         const inputValue = inputField.value;
//         const response = chatbot(inputValue);
//         console.log("Bot:", response);
//         inputField.value = '';
//     }
// });

const chatbot = require('../../test.js');
var conversation = document.getElementById('conversation');
var messageInput = document.getElementById('write-message');
messageInput.focus();
const breakLine = '<br>';

messageInput.onkeydown = function(e) {
if (e.keyCode == 13) {
    var text = messageInput.value;
    messageInput.value = '';
    sendMessage(text);
}
};
function sendMessage(text) {
    if (!text || text.length <= 0) {
        messageInput.focus();
        return;
    }
    printMessage(text, false);
    messageInput.focus();
    const response = chatbot(text);
    printMessage(response, true);
}

function printMessage(text, isBot) {
    conversation.innerHTML += getHtmlMessage(text, isBot);
    scrollConversationToBottom();
}

function getHtmlMessage(text, isBot) {
    var customClass = isBot ? 'msg-wonki' : 'msg-you';
    return `
        <p class="message ${customClass}">
            ${text} ${breakLine}
        </p>
    `;
}

function scrollConversationToBottom() {
    conversation.scrollTop = conversation.scrollHeight;
}