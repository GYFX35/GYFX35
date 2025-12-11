document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('main-nav');
    if (!navContainer) return;

    const navLinks = [
        { href: 'index.html#peace', text: 'Peace & Stability' },
        { href: 'index.html#youth', text: 'Youth Entrepreneurship' },
        { href: 'index.html#wellbeing', text: 'Wellbeing' },
        { href: 'agriculture.html', text: 'Agriculture' },
        { href: 'environment.html', text: 'Environment' },
        { href: 'health.html', text: 'Health' },
        { href: 'education.html', text: 'Education' },
        { href: 'games.html', text: 'Games' },
        { href: 'worldbank.html', text: 'World Bank Data' },
        { href: 'apis.html', text: 'International Data' },
        { href: 'developer.html', text: 'Developer' }
    ];

    const nav = document.createElement('nav');
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.textContent = 'Home';
    logoDiv.appendChild(logoLink);
    nav.appendChild(logoDiv);

    const ul = document.createElement('ul');
    navLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);

    navContainer.appendChild(nav);
});
