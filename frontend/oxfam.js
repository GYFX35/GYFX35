document.addEventListener('DOMContentLoaded', () => {
    fetchOxfamData();
});

async function fetchOxfamData() {
    const container = document.getElementById('oxfam-container');
    container.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('/api/oxfam');
        const data = await response.json();

        container.innerHTML = '';

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const table = createOxfamTable(data);
        container.appendChild(table);

    } catch (error) {
        console.error('Error fetching OXFAM data:', error);
        container.innerHTML = '<p>Could not fetch OXFAM data.</p>';
    }
}

function createOxfamTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = data[5];
    const rows = data.slice(6, -2);

    let headerRow = '<tr>';
    headerRow += `<th>${headers['Unnamed: 1']}</th>`;
    headerRow += `<th>${headers['Unnamed: 2']}</th>`;
    headerRow += `<th>${headers['Unnamed: 4']}</th>`;
    headerRow += `<th>${headers['Unnamed: 6']}</th>`;
    headerRow += `<th>${headers['Unnamed: 8']}</th>`;
    headerRow += `<th>${headers['Unnamed: 10']}</th>`;
    headerRow += '</tr>';
    thead.innerHTML = headerRow;

    rows.forEach(rowData => {
        let row = '<tr>';
        row += `<td>${rowData['Unnamed: 1']}</td>`;
        row += `<td>${(rowData['Unnamed: 2'] * 100).toFixed(2)}%</td>`;
        row += `<td>${rowData['Unnamed: 5'].toFixed(2)}%</td>`;
        row += `<td>${rowData['Unnamed: 7'].toFixed(2)}%</td>`;
        row += `<td>${rowData['Unnamed: 9'].toFixed(2)}%</td>`;
        row += `<td>${(rowData['Unnamed: 11'] * 100).toFixed(2)}%</td>`;
        row += '</tr>';
        tbody.innerHTML += row;
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}