document.addEventListener('DOMContentLoaded', () => {
    const QUERY = 'AI and digital transformation';
    const resultsContainer = document.getElementById('results-container');

    fetch('/api/google-search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: QUERY }),
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 500) {
                resultsContainer.innerHTML = '<p>The search API is not configured on the server. Please contact the site administrator.</p>';
            } else {
                resultsContainer.innerHTML = '<p>An error occurred while fetching search results.</p>';
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';

                const title = document.createElement('h3');
                const link = document.createElement('a');
                link.href = item.link;
                link.textContent = item.title;
                link.target = '_blank';
                title.appendChild(link);

                const snippet = document.createElement('p');
                snippet.textContent = item.snippet;

                resultItem.appendChild(title);
                resultItem.appendChild(snippet);
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
        if (!resultsContainer.innerHTML) {
            resultsContainer.innerHTML = '<p>Error fetching search results. Please check the console for details.</p>';
        }
    });
});
