document.addEventListener('DOMContentLoaded', () => {
    loadThreads();
    document.getElementById('new-thread-form').addEventListener('submit', handleNewThreadSubmit);
});

function loadThreads() {
    const threads = getThreadsFromStorage();
    const threadsContainer = document.querySelector('.forum-threads');
    threadsContainer.innerHTML = ''; // Clear existing content before loading
    threads.forEach(thread => {
        const threadElement = createThreadElement(thread.title, thread.content);
        threadsContainer.appendChild(threadElement);
    });
}

function handleNewThreadSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('thread-title');
    const contentInput = document.getElementById('thread-content');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title === '' || content === '') {
        return; // Don't post empty threads
    }

    const newThread = { title, content };
    saveThreadToStorage(newThread);

    const threadElement = createThreadElement(title, content);
    document.querySelector('.forum-threads').appendChild(threadElement);

    titleInput.value = '';
    contentInput.value = '';
}

function createThreadElement(title, content) {
    const threadElement = document.createElement('div');
    threadElement.classList.add('thread');

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const contentElement = document.createElement('p');
    contentElement.textContent = content;

    threadElement.appendChild(titleElement);
    threadElement.appendChild(contentElement);

    return threadElement;
}

function getThreadsFromStorage() {
    const threadsJSON = localStorage.getItem('forumThreads');
    try {
        return threadsJSON ? JSON.parse(threadsJSON) : [];
    } catch (e) {
        console.error("Error parsing threads from localStorage", e);
        return [];
    }
}

function saveThreadToStorage(newThread) {
    const threads = getThreadsFromStorage();
    threads.push(newThread);
    localStorage.setItem('forumThreads', JSON.stringify(threads));
}
