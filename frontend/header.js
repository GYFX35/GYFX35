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
        { href: 'development.html', text: 'Development', ariaLabel: 'Navigate to Development page' },
        { href: 'solidarity.html', text: 'Solidarity', ariaLabel: 'Navigate to Solidarity page' },
        { href: 'projects.html', text: 'Projects', ariaLabel: 'Navigate to Projects page' },
        { href: 'world-bank.html', text: 'World Bank', ariaLabel: 'Navigate to World Bank page' },
        { href: 'human-rights.html', text: 'Human Rights' },
        { href: 'environment.html', text: 'Environment' },
        { href: 'arts.html', text: 'Arts' },
        { href: 'talents.html', text: 'Talents' },
        { href: 'entertainment.html', text: 'Entertainment' },
        { href: 'games.html', text: 'Games' },
        { href: 'agrobusiness.html', text: 'Agrobusiness' },
        { href: 'news.html', text: 'News' },
        { href: 'videos.html', text: 'Videos' },
        { href: 'funding.html', text: 'Funding' },
        { href: 'ai-assistant.html', text: 'AI Assistant', ariaLabel: 'Navigate to AI Assistant page' },
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

    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.textContent = 'Back to Top';
    document.body.appendChild(backToTopButton);
}

document.addEventListener('DOMContentLoaded', () => {
    createHeader();

    const backToTopButton = document.getElementById('back-to-top');

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    backToTopButton.onclick = function() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
});
