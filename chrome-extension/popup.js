document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('open-website').addEventListener('click', function() {
    chrome.tabs.create({url: 'https://prompt-engineering.github.io/Global-Peace-Youth-Entrepreneurship-and-Wellbeing-Platform/'});
  });
});
