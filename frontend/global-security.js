document.addEventListener('DOMContentLoaded', () => {
    const wantedContainer = document.getElementById('wanted-container');

    fetch('https://api.fbi.gov/wanted/v1/list')
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                data.items.forEach(person => {
                    const personElement = document.createElement('div');
                    personElement.classList.add('wanted-person');

                    const title = document.createElement('h3');
                    title.textContent = person.title;
                    personElement.appendChild(title);

                    if (person.images && person.images.length > 0) {
                        const image = document.createElement('img');
                        image.src = person.images[0].original;
                        image.alt = person.title;
                        personElement.appendChild(image);
                    }

                    if (person.description) {
                        const description = document.createElement('p');
                        description.textContent = person.description;
                        personElement.appendChild(description);
                    }

                    if (person.url) {
                        const link = document.createElement('a');
                        link.href = person.url;
                        link.textContent = 'More Details';
                        link.target = '_blank';
                        personElement.appendChild(link);
                    }

                    wantedContainer.appendChild(personElement);
                });
            } else {
                wantedContainer.textContent = 'No wanted persons found.';
            }
        })
        .catch(error => {
            console.error('Error fetching FBI Wanted data:', error);
            wantedContainer.textContent = 'Failed to load wanted persons data.';
        });
});
