document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.querySelector('.articles-container');

    const newsArticles = [
        {
            title: 'Global Summit on Peace and Development',
            imageUrl: 'https://via.placeholder.com/300x200',
            summary: 'World leaders gathered to discuss pressing global issues and chart a course for a more peaceful and prosperous future.',
            link: '#'
        },
        {
            title: 'Youth-Led Innovation Challenge Winners Announced',
            imageUrl: 'https://via.placeholder.com/300x200',
            summary: 'The annual innovation challenge recognized young entrepreneurs for their groundbreaking solutions to social and environmental problems.',
            link: '#'
        },
        {
            title: 'New Study Highlights the Importance of Mental Wellbeing',
            imageUrl: 'https://via.placeholder.com/300x200',
            summary: 'A recent study published in a leading medical journal underscores the critical link between mental health and overall wellbeing.',
            link: '#'
        }
    ];

    function renderArticles() {
        articlesContainer.innerHTML = '';
        newsArticles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('article');

            articleElement.innerHTML = `
                <img src="${article.imageUrl}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <a href="${article.link}" target="_blank" rel="noopener noreferrer">Read More</a>
            `;

            articlesContainer.appendChild(articleElement);
        });
    }

    renderArticles();
});
