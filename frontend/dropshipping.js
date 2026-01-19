// Add custom JavaScript for the dropshipping page here
console.log('Dropshipping page loaded');

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const formData = {
                name,
                email,
                message
            };

            console.log('Form submitted:', formData);
            alert('Thank you for your interest! We will get back to you soon.');

            // Clear the form
            signupForm.reset();
        });
    }
});
