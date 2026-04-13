function createHeader() {
    const header = document.querySelector('header') || document.createElement('header');
    header.setAttribute('role', 'banner');
    header.innerHTML = ''; // Clear existing content if any

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
        { href: 'index.html', text: 'Home', ariaLabel: 'Go to Home' },
        { href: 'projects.html', text: 'Projects', ariaLabel: 'View Projects' },
        { href: 'global-governments.html', text: 'Governments', ariaLabel: 'Global Government Initiatives' },
        { href: 'global-ngos.html', text: 'NGOs', ariaLabel: 'Global NGO Initiatives' },
        { href: 'global-security.html', text: 'Security', ariaLabel: 'Global Security Initiatives' },
        { href: 'ai-assistant.html', text: 'AI Assistant', ariaLabel: 'AI Assistant' },
        { href: 'codex/index.html', text: 'Codex', ariaLabel: 'Global Navigation Codex' },
        { href: 'funding.html', text: 'Donate', ariaLabel: 'Support our projects' }
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

    const skipLink = document.querySelector('.skip-link') || document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';

    if (!document.body.contains(skipLink)) {
        document.body.prepend(skipLink);
    }
    if (!document.body.contains(header)) {
        document.body.prepend(header);
    }

    if (!document.getElementById('back-to-top')) {
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'back-to-top';
        backToTopButton.textContent = '↑';
        backToTopButton.title = 'Back to Top';
        document.body.appendChild(backToTopButton);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createHeader();

    const backToTopButton = document.getElementById('back-to-top');

    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            if (backToTopButton) backToTopButton.style.display = "block";
        } else {
            if (backToTopButton) backToTopButton.style.display = "none";
        }
    };

    if (backToTopButton) {
        backToTopButton.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
