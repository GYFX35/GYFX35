document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedback-form');
    const ideaInput = document.getElementById('idea-input');
    const feedbackResponse = document.getElementById('feedback-response');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const authMessage = document.getElementById('auth-message');

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

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value.trim();

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            authMessage.innerText = data.message || data.error;
        })
        .catch(error => {
            console.error('Error:', error);
            authMessage.innerText = 'Sorry, something went wrong.';
        });
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/profile.html';
            }
            authMessage.innerText = data.message || data.error;
        })
        .catch(error => {
            console.error('Error:', error);
            authMessage.innerText = 'Sorry, something went wrong.';
        });
    });
});
