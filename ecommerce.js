document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');

    const products = [
        { id: 1, name: 'Eco-friendly Water Bottle', description: 'A reusable water bottle made from recycled materials.' },
        { id: 2, name: 'Handmade Beaded Bracelet', description: 'A beautiful bracelet crafted by artisans in a local community.' },
        { id: 3, name: 'Organic Cotton T-Shirt', description: 'A soft and comfortable t-shirt made from 100% organic cotton.' }
    ];

    const productGrid = document.querySelector('.product-grid');
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
        `;
        productGrid.appendChild(productItem);
    });

    chatSubmit.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message === '') return;

        displayMessage('user', message);
        chatInput.value = '';

        fetch('/api/ecommerce-assistant', {
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
