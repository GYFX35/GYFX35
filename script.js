document.addEventListener('DOMContentLoaded', () => {
    displayMockWHOData();
    displayMockWorldBankData();
    displayMockUNICEFData();
    displayMockILOData();
});

function displayMockWHOData() {
    const whoDataElement = document.querySelector('#who-data p');
    whoDataElement.textContent = 'Global Average Life Expectancy: 73.4 years';
}

function displayMockWorldBankData() {
    const worldBankDataElement = document.querySelector('#world-bank-data p');
    worldBankDataElement.textContent = 'World Population (2022): 7.9 billion';
}

function displayMockUNICEFData() {
    const unicefDataElement = document.querySelector('#unicef-data p');
    unicefDataElement.textContent = 'Focus: Protecting children and their rights worldwide.';
}

function displayMockILOData() {
    const iloDataElement = document.querySelector('#ilo-data p');
    iloDataElement.textContent = 'Global Youth Unemployment Rate (2022): 15.6%';
}
