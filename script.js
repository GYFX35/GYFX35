document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutLink = document.getElementById('logout-link');

    if (token) {
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        logoutLink.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        signupLink.style.display = 'inline-block';
        logoutLink.style.display = 'none';
    }

    const chatbotSendButton = document.getElementById('chatbot-send');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    chatbotSendButton.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;

        appendMessage(message, 'user');
        chatbotInput.value = '';

        fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
        .then(response => response.json())
        .then(data => {
            appendMessage(data.response, 'bot');
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('Sorry, something went wrong.', 'bot');
        });
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', `${sender}-message`);
        messageElement.innerText = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    const feedbackForm = document.getElementById('feedback-form');
    const ideaInput = document.getElementById('idea-input');
    const feedbackResponse = document.getElementById('feedback-response');

    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const idea = ideaInput.value.trim();
        if (idea === '') return;

        fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idea }),
        })
        .then(response => response.json())
        .then(data => {
            feedbackResponse.innerText = data.response;
        })
        .catch(error => {
            console.error('Error:', error);
            feedbackResponse.innerText = 'Sorry, something went wrong.';
        });
    });
});
