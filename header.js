function createHeader() {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main Navigation');

    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.textContent = 'GPW';
    logoDiv.appendChild(logoLink);
    nav.appendChild(logoDiv);

    const ul = document.createElement('ul');
    const navItems = [
        { href: 'index.html#peace', text: 'Peace & Stability', ariaLabel: 'Navigate to Peace and Stability section' },
        { href: 'index.html#youth', text: 'Youth Entrepreneurship', ariaLabel: 'Navigate to Youth Entrepreneurship section' },
        { href: 'index.html#wellbeing', text: 'Wellbeing', ariaLabel: 'Navigate to Wellbeing section' },
        { href: 'human-rights.html', text: 'Human Rights' },
        { href: 'environment.html', text: 'Environment' },
        { href: 'arts.html', text: 'Arts' },
        { href: 'talents.html', text: 'Talents' },
        { href: 'entertainment.html', text: 'Entertainment' },
        { href: 'news.html', text: 'News' },
        { href: 'videos.html', text: 'Videos' },
        { href: 'funding.html', text: 'Funding' },
        { href: 'settings.html', text: 'Settings', ariaLabel: 'Navigate to Settings page' },
        { href: 'profile.html', text: 'Profile' }
    ];

    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        if (item.ariaLabel) {
            a.setAttribute('aria-label', item.ariaLabel);
        }
        li.appendChild(a);
        ul.appendChild(li);
    });
    nav.appendChild(ul);

    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    nav.appendChild(translateDiv);

    header.appendChild(nav);

    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';

    document.body.prepend(header);
    document.body.prepend(skipLink);
}

document.addEventListener('DOMContentLoaded', createHeader);
