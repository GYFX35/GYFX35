
// Add scroll-in animation for feature sections
const features = document.querySelectorAll('.feature');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

features.forEach(feature => {
    observer.observe(feature);
});

// Fetch and display the Quote of the Day
function fetchQuote() {
    const quoteElement = document.getElementById('daily-quote').querySelector('p');
    const authorElement = document.getElementById('daily-quote').querySelector('footer');

    fetch('https://zenquotes.io/api/today')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                quoteElement.textContent = `"${data[0].q}"`;
                authorElement.textContent = `- ${data[0].a}`;
            }
        })
        .catch(error => {
            console.error('Error fetching the quote:', error);
        });
}

// Fetch and display the "Good News" feed
function fetchNews() {
    const newsContainer = document.getElementById('news-container');
    const apiKey = 'cb290e292780447a9eda8245f7cb72a8';
    const keywords = 'peace OR wellbeing OR "youth empowerment" OR "humanitarian aid"';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&apiKey=${apiKey}&pageSize=5&sortBy=publishedAt`;

    newsContainer.innerHTML = '<p>Loading news...</p>';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            newsContainer.innerHTML = '';
            if (data.articles && data.articles.length > 0) {
                data.articles.forEach(article => {
                    const articleElement = document.createElement('div');
                    articleElement.classList.add('news-article');
                    articleElement.innerHTML = `
                        <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                        <p>${article.description}</p>
                        <small>${new Date(article.publishedAt).toLocaleString()}</small>
                    `;
                    newsContainer.appendChild(articleElement);
                });
            } else {
                newsContainer.innerHTML = '<p>No news articles found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Could not fetch the latest news. Please try again later.</p>';
        });
}

// Fetch and display UNESCO youth literacy data
async function fetchLiteracyData() {
    const container = document.getElementById('literacy-rate-container');
    if (!container) {
        console.error('Error: #literacy-rate-container element not found in the DOM.');
        return;
    }

    const indicator = 'LR.AG15T24';
    const url = `https://api.uis.unesco.org/api/public/data/indicators?indicator=${indicator}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.records && data.records.length > 0) {
            const mostRecentYear = data.records.reduce((max, p) => p.year > max ? p.year : max, 0);
            const recentRecords = data.records.filter(r => r.year === mostRecentYear && r.value !== null);
            const averageLiteracy = recentRecords.reduce((sum, r) => sum + r.value, 0) / recentRecords.length;

            if (!isNaN(averageLiteracy)) {
                const literacyRate = averageLiteracy.toFixed(2);
                container.innerHTML = `
                    <p>${literacyRate}%</p>
                    <span>Global Average (Proxy) for ${mostRecentYear}</span>
                `;
            } else {
                 container.innerHTML = '<p>Could not calculate average data.</p>';
            }
        } else {
             container.innerHTML = '<p>Data not available</p>';
        }
    } catch (error) {
        console.error('Error fetching UNESCO data:', error);
        container.innerHTML = '<p>Could not load data</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchQuote();
    fetchNews();
    fetchLiteracyData();
});
