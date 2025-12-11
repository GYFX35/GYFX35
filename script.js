document.addEventListener('DOMContentLoaded', () => {
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
