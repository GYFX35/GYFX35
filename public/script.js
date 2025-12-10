document.addEventListener('DOMContentLoaded', () => {
    fetchUNData();
});

async function fetchUNData() {
    const dataContainer = document.getElementById('un-data-container');
    try {
        const response = await fetch('/api/refugee-data');
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const stats = data.items[0];
            dataContainer.innerHTML = `
                <h3>Global Displacement Statistics (2023)</h3>
                <p><strong>Refugees:</strong> ${parseInt(stats.refugees).toLocaleString()}</p>
                <p><strong>Asylum-seekers:</strong> ${parseInt(stats.asylum_seekers).toLocaleString()}</p>
                <p><strong>Internally Displaced Persons (IDPs):</strong> ${parseInt(stats.idps).toLocaleString()}</p>
                <p><strong>Stateless Persons:</strong> ${parseInt(stats.stateless).toLocaleString()}</p>
            `;
        } else {
            dataContainer.innerHTML = '<p>Could not retrieve UN data. No items found.</p>';
        }
    } catch (error) {
        console.error('Error fetching UN data:', error);
        dataContainer.innerHTML = '<p>Could not load UN data at this time.</p>';
    }
}
