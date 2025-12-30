
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and populate the country dropdown
    fetch('/api/who/Dimension/COUNTRY/DimensionValues')
        .then(response => response.json())
        .then(data => {
            const countries = data.value;
            const select = document.getElementById('country-select');
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.Code;
                option.textContent = country.Title;
                select.appendChild(option);
            });
        });

    // Add event listener to the dropdown
    document.getElementById('country-select').addEventListener('change', (event) => {
        const countryCode = event.target.value;
        if (countryCode) {
            updateCharts(countryCode);
        }
    });
});

// A predefined color palette for the charts
const CHART_COLORS = [
    { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
    { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
    { background: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
    { background: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    { background: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
    { background: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' }
];

// Map of indicator codes to human-readable names
const INDICATOR_NAMES = {
    'WHOSIS_000001': 'Life expectancy at birth (years)',
    'WHOSIS_000015': 'Life expectancy at age 60 (years)',
    'NCD_BMI_MEAN': 'Mean BMI (kg/m²)',
    'MH_12': 'Suicide rate (per 100,000 population)'
};

function updateCharts(countryCode) {
    const indicators = Object.keys(INDICATOR_NAMES);

    const indicatorPromises = indicators.map(indicator => {
        // Fetch data for both sexes (BTSX) for the selected country
        const url = `/api/who/${indicator}?$filter=SpatialDim eq '${countryCode}' and Dim1 eq 'SEX_BTSX'`;
        return fetch(url).then(response => response.json());
    });

    Promise.all(indicatorPromises)
        .then(results => {
            // Create a comprehensive set of all years from all indicators
            const allYears = new Set();
            results.forEach(result => {
                if (result.value) {
                    result.value.forEach(dp => allYears.add(dp.TimeDim));
                }
            });

            // Sort the years chronologically
            const sortedYears = Array.from(allYears).sort();

            const datasets = results.map((result, index) => {
                const indicator = indicators[index];
                const dataPoints = result.value || [];

                // Create a map of year to numeric value for quick lookup
                const dataMap = new Map(dataPoints.map(dp => [dp.TimeDim, dp.NumericValue]));

                // Align data with the sorted years, using null for missing years
                const alignedData = sortedYears.map(year => dataMap.get(year) || null);

                const color = CHART_COLORS[index % CHART_COLORS.length];

                return {
                    label: INDICATOR_NAMES[indicator] || indicator, // Use readable name, fallback to code
                    data: alignedData,
                    backgroundColor: color.background,
                    borderColor: color.border,
                    borderWidth: 1
                };
            });

            renderChart(sortedYears, datasets);
        })
        .catch(error => console.error('Error fetching indicator data:', error));
}

function renderChart(labels, datasets) {
    const container = document.getElementById('charts-container');
    container.innerHTML = ''; // Clear previous chart

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels, // Use the actual sorted years
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    // Display value even if it's null
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                            } else {
                                label += 'No data';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}
