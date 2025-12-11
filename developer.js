document.addEventListener('DOMContentLoaded', () => {
    const githubContainer = document.querySelector('#github-data .data-container');

    const fetchGitHubData = async () => {
        if (!githubContainer) return;

        try {
            const response = await fetch('https://api.github.com/repositories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            githubContainer.innerHTML = ''; // Clear previous content

            if (data && data.length > 0) {
                const ul = document.createElement('ul');
                data.slice(0, 10).forEach(repo => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = repo.html_url;
                    a.target = '_blank';
                    a.textContent = repo.name;
                    li.appendChild(a);
                    li.appendChild(document.createTextNode(`: ${repo.description || ''}`));
                    ul.appendChild(li);
                });
                githubContainer.appendChild(ul);
            } else {
                const p = document.createElement('p');
                p.textContent = 'No data available.';
                githubContainer.appendChild(p);
            }
        } catch (error) {
            const p = document.createElement('p');
            p.textContent = `Error fetching data: ${error.message}`;
            githubContainer.appendChild(p);
        }
    };

    fetchGitHubData();
});
