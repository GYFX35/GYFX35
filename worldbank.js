document.addEventListener('DOMContentLoaded', () => {
    const indicators = {
        'agriculture-data': 'AG.LND.AGRI.ZS', // Agricultural land (% of land area)
        'environment-data': 'AG.LND.FRST.ZS', // Forest area (% of land area)
        'health-data': 'SH.DYN.MORT',       // Mortality rate, under-5 (per 1,000 live births)
        'education-data': 'SE.PRM.CMPT.ZS'     // Primary completion rate, total (% of relevant age group)
    };

    const countries = 'BRA;RUS;IND;CHN;ZAF'; // BRICS countries

    const fetchData = async (sectionId, indicatorId) => {
        const container = document.querySelector(`#${sectionId} .data-container`);
        if (!container) return;

        try {
            const response = await fetch(`https://api.worldbank.org/v2/country/${countries}/indicator/${indicatorId}?format=json&mrnev=1`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data && data.length > 1 && data[1]) {
                let html = '<ul>';
                data[1].forEach(item => {
                    const value = item.value ? parseFloat(item.value).toFixed(2) : 'N/A';
                    html += `<li><strong>${item.country.value}:</strong> ${item.indicator.value} (${item.date}) - ${value}</li>`;
                });
                html += '</ul>';
                container.innerHTML = html;
            } else {
                container.innerHTML = '<p>No data available for this indicator.</p>';
            }
        } catch (error) {
            container.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        }
    };

    for (const section in indicators) {
        fetchData(section, indicators[section]);
    }
});
