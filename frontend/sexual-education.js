
document.addEventListener('DOMContentLoaded', () => {
    // Fetch and populate the country dropdown from WHO API
    fetch('/api/who/Dimension/COUNTRY/DimensionValues')
        .then(response => response.json())
        .then(data => {
            const countries = data.value;
            const select = document.getElementById('country-select');
            if (select) {
                countries.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.Code;
                    option.textContent = country.Title;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error fetching countries:', error));

    // Add event listener to the dropdown
    const countrySelect = document.getElementById('country-select');
    if (countrySelect) {
        countrySelect.addEventListener('change', (event) => {
            const countryCode = event.target.value;
            if (countryCode) {
                updateCharts(countryCode);
            }
        });
    }
});

// A predefined color palette for the charts
const CHART_COLORS = [
    { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
    { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
    { background: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    { background: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
    { background: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' }
];

// Map of indicator codes to human-readable names for sexual health
const INDICATOR_NAMES = {
    'STI_SYPHILIS_PREVALENCE_PER100': 'Syphilis prevalence in 15-49 year olds (%)',
    'STI_GONORRHEA_CASES_NUM': 'Reported cases of gonorrhea (number)',
    'PerctestedANC': 'Women in ANC tested for syphilis (%)',
    'HIV_ARTCOVERAGE': 'HIV antiretroviral therapy coverage (%)',
    'fpsmowho': 'Demand for family planning satisfied - modern methods (%)'
};

function updateCharts(countryCode) {
    const indicators = Object.keys(INDICATOR_NAMES);
    const container = document.getElementById('charts-container');
    container.innerHTML = '<p>Loading data...</p>';

    const indicatorPromises = indicators.map(indicator => {
        // Fetch data for the selected country
        // Note: Filters might vary by indicator, some use SpatialDim, some use other dims.
        // For simplicity, we try a standard filter.
        const url = `/api/who/${indicator}?$filter=SpatialDim eq '${countryCode}'`;
        return fetch(url).then(response => response.json());
    });

    Promise.all(indicatorPromises)
        .then(results => {
            // Create a comprehensive set of all years from all indicators
            const allYears = new Set();
            results.forEach(result => {
                if (result && result.value) {
                    result.value.forEach(dp => {
                        if (dp.TimeDim) allYears.add(dp.TimeDim);
                    });
                }
            });

            // Sort the years chronologically
            const sortedYears = Array.from(allYears).sort();

            if (sortedYears.length === 0) {
                container.innerHTML = '<p>No data available for this country.</p>';
                return;
            }

            const datasets = results.map((result, index) => {
                const indicator = indicators[index];
                const dataPoints = (result && result.value) ? result.value : [];

                // Create a map of year to numeric value for quick lookup
                const dataMap = new Map();
                dataPoints.forEach(dp => {
                    // If multiple data points for the same year, we just take the first one or a specific sex if available
                    // Here we prefer BTSX (Both Sexes) if it exists, otherwise any.
                    if (!dataMap.has(dp.TimeDim) || dp.Dim1 === 'SEX_BTSX') {
                        dataMap.set(dp.TimeDim, dp.NumericValue);
                    }
                });

                // Align data with the sorted years, using null for missing years
                const alignedData = sortedYears.map(year => {
                    const val = dataMap.get(year);
                    return val !== undefined ? val : null;
                });

                const color = CHART_COLORS[index % CHART_COLORS.length];

                return {
                    label: INDICATOR_NAMES[indicator] || indicator,
                    data: alignedData,
                    backgroundColor: color.background,
                    borderColor: color.border,
                    borderWidth: 1,
                    hidden: index > 0 // Hide all but the first dataset by default to avoid clutter
                };
            });

            renderChart(sortedYears, datasets);
        })
        .catch(error => {
            console.error('Error fetching indicator data:', error);
            container.innerHTML = '<p>Error loading data. Please try again later.</p>';
        });
}

function renderChart(labels, datasets) {
    const container = document.getElementById('charts-container');
    container.innerHTML = ''; // Clear previous chart

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    new Chart(canvas, {
        type: 'line', // Line chart often better for time series
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
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
