
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    const map = L.map('map').setView([20, 0], 2);

    // Add a tile layer from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch youth unemployment data from the World Bank API
    // Indicator for unemployment, youth total (% of total labor force ages 15-24)
    const indicator = 'SL.UEM.1524.ZS';
    const url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&date=2022&per_page=300`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // The first element of the data array contains metadata, the second contains the actual data
            if (data && data.length > 1) {
                const countryData = data[1];
                countryData.forEach(country => {
                    if (country.value !== null && country.countryiso3code) {
                        // Fetch country coordinates (this is a simplified approach)
                        // A more robust solution would use a local lookup or a dedicated geocoding API
                        fetch(`https://restcountries.com/v3.1/alpha/${country.countryiso3code}`)
                            .then(res => res.json())
                            .then(geoData => {
                                if (geoData && geoData.length > 0 && geoData[0].latlng) {
                                    const [lat, lon] = geoData[0].latlng;
                                    const unemploymentRate = parseFloat(country.value).toFixed(2);
                                    const popupContent = `
                                        <b>${country.country.value}</b><br>
                                        Youth Unemployment: ${unemploymentRate}% (${country.date})
                                    `;
                                    L.marker([lat, lon]).addTo(map)
                                        .bindPopup(popupContent);
                                }
                            });
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching World Bank data:', error);
        });
});
