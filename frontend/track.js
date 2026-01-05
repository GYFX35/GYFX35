document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/users/count')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const userCountElement = document.getElementById('user-count');
            if (userCountElement) {
                userCountElement.textContent = data.count !== undefined ? data.count : 'N/A';
            }
        })
        .catch(error => {
            console.error('Error fetching user count:', error);
            const userCountElement = document.getElementById('user-count');
            if (userCountElement) {
                userCountElement.textContent = 'Could not load user count.';
            }
        });

    fetch('/api/funding')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const fundingOptionsElement = document.getElementById('funding-options');
            if (fundingOptionsElement) {
                let html = '<ul>';
                if (data.github) {
                    html += `<li><a href="https://github.com/sponsors/${data.github}" target="_blank">GitHub Sponsors</a></li>`;
                }
                if (data.patreon) {
                    html += `<li><a href="https://www.patreon.com/${data.patreon}" target="_blank">Patreon</a></li>`;
                }
                if (data.kickstarter) {
                    html += `<li><a href="https://www.kickstarter.com/projects/${data.kickstarter}" target="_blank">Kickstarter</a></li>`;
                }
                if (data.custom && data.custom.length > 0) {
                    data.custom.forEach(url => {
                        html += `<li><a href="${url}" target="_blank">${url}</a></li>`;
                    });
                }
                html += '</ul>';
                fundingOptionsElement.innerHTML = html;
            }
        })
        .catch(error => {
            console.error('Error fetching funding options:', error);
            const fundingOptionsElement = document.getElementById('funding-options');
            if (fundingOptionsElement) {
                fundingOptionsElement.textContent = 'Could not load funding options.';
            }
        });
});
