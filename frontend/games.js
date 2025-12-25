document.addEventListener('DOMContentLoaded', () => {
    const games = [
        { title: 'Health Quiz', description: 'Test your knowledge about health and nutrition.' },
        { title: 'Eco Saver', description: 'A game about environmental conservation.' },
        { title: 'Finance 101', description: 'Learn the basics of financial literacy.' }
    ];

    const gamesContainer = document.querySelector('.games-container');

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';

        const title = document.createElement('h3');
        title.textContent = game.title;

        const description = document.createElement('p');
        description.textContent = game.description;

        gameCard.appendChild(title);
        gameCard.appendChild(description);
        gamesContainer.appendChild(gameCard);
    });
});
