document.addEventListener('DOMContentLoaded', () => {
    const eurostatContainer = document.querySelector('#eurostat-data .data-container');

    const displayMockData = () => {
        if (!eurostatContainer) return;

        const mockData = {
            "value": {
                "0": 21.3,
                "1": 21.1,
                "2": 21.6,
                "3": 22.2,
                "4": 22.9
            },
            "dimension": {
                "time": {
                    "category": {
                        "index": {
                            "0": "2018",
                            "1": "2019",
                            "2": "2020",
                            "3": "2021",
                            "4": "2022"
                        }
                    }
                }
            }
        };

        let html = '<ul>';
        for (const [index, value] of Object.entries(mockData.value)) {
            const year = mockData.dimension.time.category.index[index];
            html += `<li><strong>Year ${year}:</strong> ${value}</li>`;
        }
        html += '</ul>';
        eurostatContainer.innerHTML = html;
    };

    displayMockData();
});
