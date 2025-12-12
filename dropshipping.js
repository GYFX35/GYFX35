document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');

    chatSubmit.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        displayMessage('user', message);
        chatInput.value = '';

        fetch('/api/dropshipping-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        })
        .then(response => response.json())
        .then(data => {
            displayMessage('assistant', data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('assistant', 'Sorry, something went wrong.');
        });
    });

    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.innerText = `${sender}: ${message}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});
