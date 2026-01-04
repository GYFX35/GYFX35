document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('uis-data-container');

    async function fetchUisData() {
        try {
            const response = await fetch('/api/uis/definitions/indicators');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayData(data);
        } catch (error) {
            console.error('Error fetching UIS data:', error);
            dataContainer.innerHTML = '<p>Error loading data. Please try again later.</p>';
        }
    }

    function displayData(indicators) {
        if (!indicators || indicators.length === 0) {
            dataContainer.innerHTML = '<p>No data available.</p>';
            return;
        }

        const list = document.createElement('ul');
        indicators.forEach(indicator => {
            const listItem = document.createElement('li');
            listItem.textContent = `${indicator.indicatorCode}: ${indicator.name}`;
            list.appendChild(listItem);
        });
        dataContainer.appendChild(list);
    }

    fetchUisData();
});
