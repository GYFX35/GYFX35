document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('unesco-data-container');

    fetch('https://api.uis.unesco.org/api/public/definitions/indicators')
        .then(response => response.json())
        .then(data => {
            const indicators = data.map(indicator => {
                return `
                    <div class="indicator">
                        <h3>${indicator.name}</h3>
                        <p>Theme: ${indicator.theme}</p>
                    </div>
                `;
            }).join('');
            dataContainer.innerHTML = indicators;
        })
        .catch(error => {
            console.error('Error fetching UNESCO data:', error);
            dataContainer.innerHTML = '<p>Could not load data from UNESCO.</p>';
        });
});
