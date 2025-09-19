// This is the script file for the Global Business Compliance Assistant.
document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country-select');
    const complianceInfoDiv = document.getElementById('compliance-info');

    const indicators = {
        'Ease of doing business rank (1=most business-friendly)': 'IC.BUS.EASE.XQ',
        'Procedures to start a business (number)': 'IC.REG.PROC',
        'Time to start a business (days)': 'IC.REG.DURS',
        'Cost of start-up procedures (% of GNI per capita)': 'IC.REG.COST.PC.ZS',
        'Tax payments (number per year)': 'IC.TAX.PAYM.NO'
    };

    if (countrySelect) {
        countrySelect.addEventListener('change', async (event) => {
            const selectedCountry = event.target.value;
            if (selectedCountry) {
                complianceInfoDiv.innerHTML = '<p>Loading data...</p>';

                let content = `
                    <h2>Business Compliance Information for ${countrySelect.options[countrySelect.selectedIndex].text}</h2>
                    <p class="disclaimer"><strong>Disclaimer:</strong> The following data is from the World Bank's "Doing Business" project, which was discontinued in 2021. The data may be outdated.</p>
                    <ul>
                `;

                for (const [key, value] of Object.entries(indicators)) {
                    const url = `https://api.worldbank.org/v2/country/${selectedCountry}/indicator/${value}?format=json&mrnev=1`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        let dataValue = 'Not available';
                        if (data[1] && data[1][0] && data[1][0].value !== null) {
                            dataValue = parseFloat(data[1][0].value).toFixed(2);
                        }
                        content += `<li><strong>${key}:</strong> ${dataValue}</li>`;
                    } catch (error) {
                        console.error(`Error fetching data for ${key}:`, error);
                        content += `<li><strong>${key}:</strong> Error loading data</li>`;
                    }
                }

                content += '</ul>';
                complianceInfoDiv.innerHTML = content;
            } else {
                complianceInfoDiv.innerHTML = '';
            }
        });
    }
});
