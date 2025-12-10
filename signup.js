document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const message = document.getElementById('message');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    message.textContent = data.message;
                    message.style.color = 'green';
                } else {
                    message.textContent = data.message;
                    message.style.color = 'red';
                }
            } catch (error) {
                console.error('Error signing up:', error);
                message.textContent = 'An error occurred. Please try again.';
                message.style.color = 'red';
            }
        });
    }
});
