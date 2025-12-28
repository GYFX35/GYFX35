document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');

    // Fetch data from our GBIF proxy
    fetch('/api/gbif?limit=20') // Example: fetch the 20 most recent records
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.results || data.results.length === 0) {
                dataContainer.innerHTML = '<p>No biodiversity data found.</p>';
                return;
            }

            // Create a card for each species occurrence
            data.results.forEach(occurrence => {
                // Skip records without a scientific name
                if (!occurrence.scientificName) {
                    return;
                }

                const card = document.createElement('div');
                card.className = 'species-card';

                const title = document.createElement('h3');
                title.textContent = occurrence.scientificName;
                card.appendChild(title);

                if (occurrence.vernacularName) {
                    const commonName = document.createElement('p');
                    commonName.textContent = `Common Name: ${occurrence.vernacularName}`;
                    card.appendChild(commonName);
                }

                if (occurrence.country) {
                    const country = document.createElement('p');
                    country.textContent = `Country: ${occurrence.country}`;
                    card.appendChild(country);
                }

                // Check for associated media (images)
                if (occurrence.media && occurrence.media.length > 0) {
                    const image = occurrence.media.find(m => m.type === 'StillImage');
                    if (image && image.identifier) {
                        const imgElement = document.createElement('img');
                        imgElement.src = image.identifier;
                        imgElement.alt = occurrence.scientificName;
                        imgElement.className = 'species-image';
                        card.appendChild(imgElement);
                    }
                }

                dataContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching biodiversity data:', error);
            dataContainer.innerHTML = '<p>Could not load biodiversity data. Please try again later.</p>';
        });
});
