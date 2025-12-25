document.addEventListener('DOMContentLoaded', () => {
    const talentContainer = document.querySelector('.talent-container');
    const talentShowsList = document.getElementById('talent-shows-list');

    const talents = [
        { name: 'Talent 1', skill: 'Singer', videoUrl: 'https://via.placeholder.com/300' },
        { name: 'Talent 2', skill: 'Dancer', videoUrl: 'https://via.placeholder.com/300' },
        { name: 'Talent 3', skill: 'Magician', videoUrl: 'https://via.placeholder.com/300' }
    ];

    const talentShows = [
        { name: 'Talent Show 1', date: 'October 2025', location: 'City A' },
        { name: 'Talent Show 2', date: 'November 2025', location: 'City B' }
    ];

    talents.forEach(talent => {
        const talentElement = document.createElement('div');
        talentElement.classList.add('talent');
        talentElement.innerHTML = `
            <img src="${talent.videoUrl}" alt="${talent.name}">
            <h3>${talent.name}</h3>
            <p>${talent.skill}</p>
        `;
        talentContainer.appendChild(talentElement);
    });

    talentShows.forEach(show => {
        const showElement = document.createElement('div');
        showElement.classList.add('show');
        showElement.innerHTML = `
            <h3>${show.name}</h3>
            <p>Date: ${show.date}</p>
            <p>Location: ${show.location}</p>
        `;
        talentShowsList.appendChild(showElement);
    });
});
