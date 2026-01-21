document.addEventListener('DOMContentLoaded', () => {
    const chartsContainer = document.getElementById('charts-container');

    const indicators = [
        {
            id: 'BX.KLT.DINV.CD.WD',
            name: 'Foreign Direct Investment, Net Inflows (Current US$)',
            countries: ['USA', 'CHN', 'IND', 'BRA', 'ZAF', 'NGA', 'DEU']
        },
        {
            id: 'DT.ODA.ALLD.CD',
            name: 'Official Development Assistance Received (Current US$)',
            countries: ['USA', 'CHN', 'IND', 'BRA', 'ZAF', 'NGA', 'DEU']
        }
    ];

    indicators.forEach(indicator => {
        const chartContainer = document.createElement('div');
        chartContainer.classList.add('chart-container');
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        chartsContainer.appendChild(chartContainer);

        fetchWorldBankData(indicator.id, indicator.countries)
            .then(data => {
                createChart(canvas, indicator.name, data);
            })
            .catch(error => {
                console.error(`Error fetching data for ${indicator.name}:`, error);
                chartContainer.innerHTML = `<p>Could not load data for ${indicator.name}.</p>`;
            });
    });

    async function fetchWorldBankData(indicatorId, countries) {
        const countryString = countries.join(';');
        const url = `https://api.worldbank.org/v2/country/${countryString}/indicator/${indicatorId}?format=json&date=2010:2022`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return processData(data);
    }

    function processData(data) {
        const datasets = {};
        const labels = new Set();

        if (data[1]) {
            data[1].forEach(item => {
                if (item.value !== null) {
                    const country = item.country.value;
                    const year = item.date;
                    const value = item.value;

                    if (!datasets[country]) {
                        datasets[country] = {
                            label: country,
                            data: [],
                            fill: false,
                            borderColor: getRandomColor()
                        };
                    }
                    datasets[country].data.push({ x: year, y: value });
                    labels.add(year);
                }
            });
        }


        const sortedLabels = Array.from(labels).sort();
        for (const country in datasets) {
            datasets[country].data.sort((a, b) => a.x - b.x);
        }

        return {
            labels: sortedLabels,
            datasets: Object.values(datasets)
        };
    }

    function createChart(canvas, title, data) {
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value (Current US$)'
                        }
                    }
                }
            }
        });
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
