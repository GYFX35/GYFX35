document.addEventListener('DOMContentLoaded', () => {
    const eventsList = document.getElementById('events-list');
    const performersContainer = document.querySelector('.performers-container');

    const events = [
        { name: 'Event 1', date: 'October 2025', location: 'City A' },
        { name: 'Event 2', date: 'November 2025', location: 'City B' }
    ];

    const performers = [
        { name: 'Performer 1', type: 'Musician', imageUrl: 'https://via.placeholder.com/300' },
        { name: 'Performer 2', type: 'Comedian', imageUrl: 'https://via.placeholder.com/300' }
    ];

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.innerHTML = `
            <h3>${event.name}</h3>
            <p>Date: ${event.date}</p>
            <p>Location: ${event.location}</p>
        `;
        eventsList.appendChild(eventElement);
    });

    performers.forEach(performer => {
        const performerElement = document.createElement('div');
        performerElement.classList.add('performer');
        performerElement.innerHTML = `
            <img src="${performer.imageUrl}" alt="${performer.name}">
            <h3>${performer.name}</h3>
            <p>${performer.type}</p>
        `;
        performersContainer.appendChild(performerElement);
    });
});
