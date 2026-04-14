document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const messageDisplay = document.getElementById('message-display');
    const loadingIndicator = document.getElementById('loading-indicator');
    const chatWindow = document.getElementById('chat-window');

    // Function to display a message in the chat window
    function displayMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        messageDisplay.appendChild(messageElement);
        // Scroll to the latest message
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();

        if (userMessage === '') {
            return;
        }

        // Display user's message
        displayMessage('user', userMessage);
        messageInput.value = '';

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        chatWindow.scrollTop = chatWindow.scrollHeight;

        try {
            // Send message to the backend
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'The AI assistant is currently unavailable.');
            }

            const data = await response.json();
            const assistantMessage = data.response;

            // Display assistant's message
            displayMessage('assistant', assistantMessage);
        } catch (error) {
            console.error('Error communicating with AI assistant:', error);
            displayMessage('assistant', `Sorry, something went wrong. ${error.message}`);
        } finally {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    });

    // Initial greeting from the assistant
    displayMessage('assistant', 'Hello! I am your AI assistant. How can I help you today with strategic planning, marketing, IT support, data science, security, education, machine learning, medical consulting, or global impact initiatives?');
});
