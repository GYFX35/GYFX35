document.addEventListener('DOMContentLoaded', () => {
    const wantedContainer = document.getElementById('wanted-container');
    const cveContainer = document.getElementById('cve-container');

    // Fetch FBI Wanted List
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

    // Fetch Latest CVEs
    fetch('https://cve.circl.lu/api/last')
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const recentCVEs = data.slice(0, 50); // Limit to the 50 most recent CVEs
                recentCVEs.forEach(cve => {
                    const cveElement = document.createElement('div');
                    cveElement.classList.add('cve-item');

                    const title = document.createElement('h3');
                    title.textContent = cve.id;
                    cveElement.appendChild(title);

                    if (cve.summary) {
                        const summary = document.createElement('p');
                        summary.textContent = cve.summary;
                        cveElement.appendChild(summary);
                    }

                    if (cve.references && cve.references.length > 0) {
                        const referencesList = document.createElement('ul');
                        cve.references.forEach(ref => {
                            const referenceItem = document.createElement('li');
                            const link = document.createElement('a');
                            link.href = ref;
                            link.textContent = ref;
                            link.target = '_blank';
                            referenceItem.appendChild(link);
                            referencesList.appendChild(referenceItem);
                        });
                        cveElement.appendChild(referencesList);
                    }

                    cveContainer.appendChild(cveElement);
                });
            } else {
                cveContainer.textContent = 'No CVEs found.';
            }
        })
        .catch(error => {
            console.error('Error fetching CVE data:', error);
            cveContainer.textContent = 'Failed to load CVE data.';
        });
});
