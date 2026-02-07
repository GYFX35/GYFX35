document.addEventListener('DOMContentLoaded', () => {
    initSdgData();
    initUnepNews();
});

const UNEP_INDICATORS = {
    '12.4.2': 'Hazardous waste generated per capita (kg)',
    '15.1.2': 'Proportion of important sites for terrestrial biodiversity covered by protected areas (%)',
    '14.1.1': 'Coastal eutrophication (Index)'
};

const CHART_COLORS = [
    { background: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
    { background: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
    { background: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' }
];

let currentChart = null;

function initSdgData() {
    const countrySelect = document.getElementById('country-select');

    // Fetch GeoAreas (countries and regions)
    fetch('/api/unep/sdg/GeoArea/List')
        .then(response => response.json())
        .then(data => {
            countrySelect.innerHTML = '<option value="">--Select a Country/Area--</option>';
            // Sort countries alphabetically
            const areas = data.sort((a, b) => a.geoAreaName.localeCompare(b.geoAreaName));
            areas.forEach(area => {
                const option = document.createElement('option');
                option.value = area.geoAreaCode;
                option.textContent = area.geoAreaName;
                countrySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching GeoAreas:', error);
            countrySelect.innerHTML = '<option value="">Error loading areas</option>';
        });

    countrySelect.addEventListener('change', (e) => {
        const geoAreaCode = e.target.value;
        if (geoAreaCode) {
            fetchIndicatorData(geoAreaCode);
        }
    });
}

function fetchIndicatorData(geoAreaCode) {
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = '<p class="placeholder-text">Loading data...</p>';

    const indicatorCodes = Object.keys(UNEP_INDICATORS);
    const promises = indicatorCodes.map(code =>
        fetch(`/api/unep/sdg/Indicator/Data?indicator=${code}&geoAreaCode=${geoAreaCode}`)
            .then(res => res.json())
    );

    Promise.all(promises)
        .then(results => {
            renderEnvironmentalChart(results);
        })
        .catch(error => {
            console.error('Error fetching indicator data:', error);
            chartsContainer.innerHTML = '<p class="placeholder-text">Error loading data. Please try another country.</p>';
        });
}

function renderEnvironmentalChart(results) {
    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = ''; // Clear loading text

    const canvas = document.createElement('canvas');
    chartsContainer.appendChild(canvas);

    // Collect all unique years across all indicators
    const yearSet = new Set();
    results.forEach(result => {
        if (result && result.data && Array.isArray(result.data)) {
            result.data.forEach(dp => {
                if (dp.timePeriodStart) {
                    yearSet.add(dp.timePeriodStart);
                }
            });
        }
    });

    const sortedYears = Array.from(yearSet).sort();

    if (sortedYears.length === 0) {
        chartsContainer.innerHTML = '<p class="placeholder-text">No data available for the selected area.</p>';
        return;
    }

    const datasets = results.map((result, index) => {
        const indicatorCode = Object.keys(UNEP_INDICATORS)[index];
        const dataPoints = (result && result.data) ? result.data : [];

        // Create a map for quick lookup
        const dataMap = new Map();
        dataPoints.forEach(dp => {
            // Some indicators have multiple series or dimensions, we take the first one for simplicity or average
            // For now, let's just take the first one we find for each year
            if (!dataMap.has(dp.timePeriodStart)) {
                dataMap.set(dp.timePeriodStart, parseFloat(dp.value));
            }
        });

        const color = CHART_COLORS[index % CHART_COLORS.length];

        return {
            label: UNEP_INDICATORS[indicatorCode],
            data: sortedYears.map(year => dataMap.has(year) ? dataMap.get(year) : null),
            backgroundColor: color.background,
            borderColor: color.border,
            borderWidth: 2,
            tension: 0.1,
            fill: false
        };
    });

    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: sortedYears,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

function initUnepNews() {
    const newsContainer = document.getElementById('news-container');

    fetch('/api/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'site:unep.org news stories' })
    })
    .then(response => response.json())
    .then(data => {
        newsContainer.innerHTML = '';
        if (!data.items || data.items.length === 0) {
            newsContainer.innerHTML = '<p class="placeholder-text">No recent news found.</p>';
            return;
        }

        data.items.slice(0, 6).forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-card';

            const title = document.createElement('h3');
            const link = document.createElement('a');
            link.href = item.link;
            link.target = '_blank';
            link.textContent = item.title;
            title.appendChild(link);

            const snippet = document.createElement('p');
            snippet.textContent = item.snippet;

            card.appendChild(title);
            card.appendChild(snippet);
            newsContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching UNEP news:', error);
        newsContainer.innerHTML = '<p class="placeholder-text">Could not load news at this time.</p>';
    });
}
