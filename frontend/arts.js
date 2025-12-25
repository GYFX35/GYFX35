document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery-container');
    const exhibitionsList = document.getElementById('exhibitions-list');

    const artworks = [
        { title: 'Artwork 1', artist: 'Artist 1', imageUrl: 'https://via.placeholder.com/300' },
        { title: 'Artwork 2', artist: 'Artist 2', imageUrl: 'https://via.placeholder.com/300' },
        { title: 'Artwork 3', artist: 'Artist 3', imageUrl: 'https://via.placeholder.com/300' }
    ];

    const exhibitions = [
        { name: 'Exhibition 1', date: 'October 2025', location: 'City A' },
        { name: 'Exhibition 2', date: 'November 2025', location: 'City B' }
    ];

    artworks.forEach(artwork => {
        const artworkElement = document.createElement('div');
        artworkElement.classList.add('artwork');
        artworkElement.innerHTML = `
            <img src="${artwork.imageUrl}" alt="${artwork.title}">
            <h3>${artwork.title}</h3>
            <p>${artwork.artist}</p>
        `;
        galleryContainer.appendChild(artworkElement);
    });

    exhibitions.forEach(exhibition => {
        const exhibitionElement = document.createElement('div');
        exhibitionElement.classList.add('exhibition');
        exhibitionElement.innerHTML = `
            <h3>${exhibition.name}</h3>
            <p>Date: ${exhibition.date}</p>
            <p>Location: ${exhibition.location}</p>
        `;
        exhibitionsList.appendChild(exhibitionElement);
    });
});
