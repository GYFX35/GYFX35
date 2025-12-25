// This file will contain the logic for handling the site's navigation.

function createFooter() {
    const footer = document.createElement('footer');

    const p = document.createElement('p');
    p.innerHTML = '&copy; 2025 Global Peace, Youth Entrepreneurship, and Wellbeing. All rights reserved.';
    footer.appendChild(p);

    document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', () => {
    createFooter();
});
