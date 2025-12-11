document.addEventListener('DOMContentLoaded', () => {

    const fetchData = async (indicator, elementId, unit = '') => {
        const url = `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}?format=json&per_page=1&date=2020:2023`;
        const element = document.getElementById(elementId);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${indicator}`);
            }
            const data = await response.json();

            if (data && data[1] && data[1][0] && data[1][0].value !== null) {
                const value = data[1][0].value;
                let formattedValue;
                if (indicator === 'NY.GDP.PCAP.KD') {
                    formattedValue = `$${Math.round(value).toLocaleString()}`;
                } else if (indicator === 'SP.DYN.LE00.IN') {
                    formattedValue = `${value.toFixed(1)}${unit}`;
                }
                else {
                    formattedValue = `${value.toFixed(2)}${unit}`;
                }
                element.textContent = formattedValue;
            } else {
                element.textContent = 'N/A';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            element.textContent = 'Data not available';
        }
    };

    fetchData('SL.UEM.1524.ZS', 'youth-unemployment-data', '%');
    fetchData('SP.DYN.LE00.IN', 'life-expectancy-data', ' years');
    fetchData('NY.GDP.PCAP.KD', 'gdp-per-capita-data');

    const fetchUNHCRData = async () => {
        const element = document.getElementById('refugees-data');
        try {
            const response = await fetch('https://api.unhcr.org/population/v1/population/?year=2023&coo_all=true&coa_all=true');
            if (!response.ok) {
                throw new Error('Network response was not ok for UNHCR data');
            }
            const data = await response.json();

            if (data && data.items && data.items.length > 0) {
                const totalRefugees = data.items.reduce((total, item) => total + parseInt(item.refugees, 10), 0);
                element.textContent = totalRefugees.toLocaleString();
            } else {
                element.textContent = 'N/A';
            }
        } catch (error) {
            console.error('Error fetching UNHCR data:', error);
            element.textContent = 'Data not available';
        }
    };

    fetchUNHCRData();
});
