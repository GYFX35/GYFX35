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
    ul.className = 'nav-links';
    const navItems = [
        { href: 'index.html', text: 'Home', ariaLabel: 'Navigate to Home page' },
        { href: 'index.html#peace', text: 'Peace', ariaLabel: 'Navigate to Peace and Stability section' },
        { href: 'index.html#youth', text: 'Entrepreneurship', ariaLabel: 'Navigate to Youth Entrepreneurship section' },
        { href: 'index.html#wellbeing', text: 'Wellbeing', ariaLabel: 'Navigate to Wellbeing section' },
        { href: 'global-governments.html', text: 'Partnerships', ariaLabel: 'Navigate to Partnerships' },
        { href: 'ai-digital-transformation.html', text: 'Innovation', ariaLabel: 'Navigate to Innovation page' },
        { href: 'human-rights.html', text: 'Social Impact' },
        { href: 'news.html', text: 'Resources' },
        { href: 'ai-assistant.html', text: 'AI Assistant', ariaLabel: 'Navigate to AI Assistant page' },
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
