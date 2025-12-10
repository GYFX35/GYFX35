// Add scroll-in animation for feature sections
const features = document.querySelectorAll('.feature');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

features.forEach(feature => {
    observer.observe(feature);
});
