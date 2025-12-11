// AI Educator Chatbot Logic
document.addEventListener('DOMContentLoaded', () => {
    const chatbotIcon = document.querySelector('.chatbot-icon');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const closeButton = document.querySelector('.chatbot-close');
    const sendButton = document.querySelector('.chatbot-input button');
    const userInput = document.querySelector('.chatbot-input input');
    const messagesContainer = document.querySelector('.chatbot-messages');

    let isOpen = false;

    // Show/hide chatbot window
    chatbotIcon.addEventListener('click', () => {
        isOpen = !isOpen;
        chatbotWindow.style.display = isOpen ? 'block' : 'none';
    });

    closeButton.addEventListener('click', () => {
        isOpen = false;
        chatbotWindow.style.display = 'none';
    });

    // Handle user input
    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value;
        if (userMessage.trim() !== '') {
            addMessage('user', userMessage);
            generateBotResponse(userMessage);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    // Add a message to the chat window
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Generate a response from the bot
    function generateBotResponse(userMessage) {
        const responses = {
            'peace': 'Peace is a state of harmony characterized by the lack of violent conflict and the freedom from fear of violence.',
            'entrepreneurship': 'Entrepreneurship is the process of creating or extracting value. With this definition, entrepreneurship is viewed as change, generally entailing risk beyond what is normally encountered in starting a business, which may include other values than simply economic ones.',
            'wellbeing': 'Wellbeing, also known as wellness, prudential value or quality of life, refers to that which is intrinsically valuable relative to someone.',
            'hello': 'Hello! How can I help you today?',
            'default': 'I am still under development, but I am learning. Please ask me about peace, entrepreneurship, or wellbeing.'
        };

        const lowerCaseMessage = userMessage.toLowerCase();
        let botResponse = responses['default'];

        for (const keyword in responses) {
            if (lowerCaseMessage.includes(keyword)) {
                botResponse = responses[keyword];
                break;
            }
        }

        setTimeout(() => {
            addMessage('bot', botResponse);
        }, 500);
    }
});
