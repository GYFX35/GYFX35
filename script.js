
document.addEventListener('DOMContentLoaded', () => {
    // World Bank Mock Data
    // Note: Using mock data due to CORS issues when fetching from file:// protocol.
    const worldBankContainer = document.getElementById('world-bank-container');
    const worldBankMockData = [
        { country: { value: 'China' }, value: 1425893465 },
        { country: { value: 'India' }, value: 1417173173 },
        { country: { value: 'United States' }, value: 333287557 },
        { country: { value: 'Indonesia' }, value: 275501339 },
        { country: { value: 'Pakistan' }, value: 235824862 },
    ];
    worldBankMockData.forEach(country => {
        const countryEl = document.createElement('div');
        countryEl.textContent = `${country.country.value}: ${country.value.toLocaleString()}`;
        worldBankContainer.appendChild(countryEl);
    });

    // GitHub Data
    const githubContainer = document.getElementById('github-container');
    fetch('https://api.github.com/users/worldbank/repos') // Using World Bank as an example
        .then(response => response.json())
        .then(data => {
            if (data) {
                const repoData = data.slice(0, 5); // Display top 5 repos
                repoData.forEach(repo => {
                    const repoEl = document.createElement('div');
                    const repoLink = document.createElement('a');
                    repoLink.href = repo.html_url;
                    repoLink.textContent = repo.name;
                    repoEl.appendChild(repoLink);
                    githubContainer.appendChild(repoEl);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching GitHub data:', error);
            githubContainer.textContent = 'Failed to load GitHub data.';
        });

    // Eurostat Mock Data
    // Note: Using mock data due to CORS issues when fetching from file:// protocol.
    const eurostatContainer = document.getElementById('eurostat-container');
    const eurostatMockData = [
        { country: 'Germany', value: '83.2 million' },
        { country: 'France', value: '65.3 million' },
        { country: 'Italy', value: '59.5 million' },
        { country: 'Spain', value: '47.4 million' },
        { country: 'Poland', value: '38.0 million' },
    ];

    eurostatMockData.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.textContent = `${item.country}: ${item.value}`;
        eurostatContainer.appendChild(itemEl);
    });
});
