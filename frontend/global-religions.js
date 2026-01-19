
document.addEventListener('DOMContentLoaded', function() {
    // Fetch Christianity quote
    fetch('https://bible-api.com/matthew%207:12')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const quoteElement = document.querySelector('#christianity-quote');
            if (quoteElement) {
                quoteElement.innerHTML = `<p>"${data.text.trim()}"</p>`;
            } else {
                console.error("Could not find Christianity quote element.");
            }
        })
        .catch(error => console.error('Error fetching Bible quote:', error));

    // Fetch Islam quote
    fetch('https://api.quran.com/api/v4/verses/by_key/2:83?language=en&words=true')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const verse = data.verse;
            const words = verse.words.map(word => word.translation.text).join(' ');
            const quoteElement = document.querySelector('#islam-quote');
            if (quoteElement) {
                quoteElement.innerHTML = `<p>"${words}"</p>`;
            } else {
                console.error("Could not find Islam quote element.");
            }
        })
        .catch(error => console.error('Error fetching Quran quote:', error));
});
