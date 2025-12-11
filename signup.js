document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const errorMessage = document.getElementById('error-message');
    if (response.ok) {
        window.location.href = 'login.html';
    } else {
        const error = await response.text();
        errorMessage.textContent = error;
    }
});
