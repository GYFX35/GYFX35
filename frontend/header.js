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
        { href: 'global-governments.html', text: 'Global Governments', ariaLabel: 'Navigate to Global Governments page' },
        { href: 'global-ngos.html', text: 'Global NGOs', ariaLabel: 'Navigate to Global NGOs page' },
        { href: 'global-security.html', text: 'Global Security', ariaLabel: 'Navigate to Global Security page' },
        { href: 'global-religions.html', text: 'Global Religions', ariaLabel: 'Navigate to Global Religions page' },
        { href: 'development.html', text: 'Development', ariaLabel: 'Navigate to Development page' },
        { href: 'ai-digital-transformation.html', text: 'AI & Digital Transformation', ariaLabel: 'Navigate to AI & Digital Transformation page' },
        { href: 'solidarity.html', text: 'Solidarity', ariaLabel: 'Navigate to Solidarity page' },
        { href: 'projects.html', text: 'Projects', ariaLabel: 'Navigate to Projects page' },
        { href: 'world-bank.html', text: 'World Bank', ariaLabel: 'Navigate to World Bank page' },
        { href: 'global-banks.html', text: 'Global Banks', ariaLabel: 'Navigate to Global Banks page' },
        { href: 'world-economy.html', text: 'World Economy', ariaLabel: 'Navigate to World Economy page' },
        { href: 'logistics.html', text: 'Logistics', ariaLabel: 'Navigate to Logistics page' },
        { href: 'transport-development.html', text: 'Transport Development', ariaLabel: 'Navigate to Transport Development page' },
        { href: 'technologies-performance.html', text: 'Technologies Performance', ariaLabel: 'Navigate to Technologies Performance page' },
        { href: 'human-rights.html', text: 'Human Rights' },
        { href: 'human-trafficking-prevention.html', text: 'Human Trafficking Prevention', ariaLabel: 'Navigate to Human Trafficking Prevention page' },
        { href: 'women-autonomy-entrepreneurship.html', text: 'Women Autonomy and Entrepreneurship', ariaLabel: 'Navigate to Women Autonomy and Entrepreneurship page' },
        { href: 'environment.html', text: 'Environment' },
        { href: 'biodiversity.html', text: 'Biodiversity', ariaLabel: 'Navigate to Biodiversity page' },
        { href: 'arts.html', text: 'Arts' },
        { href: 'talents.html', text: 'Talents' },
        { href: 'entertainment.html', text: 'Entertainment' },
        { href: 'games.html', text: 'Games' },
        { href: 'agrobusiness.html', text: 'Agrobusiness' },
        { href: 'news.html', text: 'News' },
        { href: 'videos.html', text: 'Videos' },
        { href: 'forums.html', text: 'Forums', ariaLabel: 'Navigate to Forums page' },
        { href: 'global-investment-finances-forum.html', text: 'Global Investment and Finances Forum', ariaLabel: 'Navigate to Global Investment and Finances Forum page' },
        { href: 'funding.html', text: 'Funding' },
        { href: 'entrepreneurship.html', text: 'EU Entrepreneurship', ariaLabel: 'Navigate to EU Entrepreneurship page' },
        { href: 'con-valores-incubadora.html', text: 'Con Valores Incubadora', ariaLabel: 'Navigate to Con Valores Incubadora page' },
        { href: 'oxfam.html', text: 'OXFAM', ariaLabel: 'Navigate to OXFAM page' },
        { href: 'ai-assistant.html', text: 'AI Assistant', ariaLabel: 'Navigate to AI Assistant page' },
        { href: 'settings.html', text: 'Settings', ariaLabel: 'Navigate to Settings page' },
        { href: 'profile.html', text: 'Profile' },
        { href: 'global_education.html', text: 'Global Education', ariaLabel: 'Navigate to Global Education page' },
        { href: 'global-universities.html', text: 'Global Universities', ariaLabel: 'Navigate to Global Universities page' },
        { href: 'who.html', text: 'WHO', ariaLabel: 'Navigate to WHO page' },
        { href: 'uis.html', text: 'UIS Data', ariaLabel: 'Navigate to UIS Data page' },
        { href: 'services.html', text: 'Public Services', ariaLabel: 'Navigate to Global Public Services and Assistance page' },
        { href: 'mobile-operator.html', text: 'Mobile Operator', ariaLabel: 'Navigate to Mobile Operator page' },
        { href: 'dropshipping.html', text: 'Dropshipping', ariaLabel: 'Navigate to Dropshipping page' }
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
