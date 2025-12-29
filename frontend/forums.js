document.addEventListener('DOMContentLoaded', () => {
    const newPostForm = document.getElementById('new-post-form');
    const generalDiscussionList = document.getElementById('general-discussion-list');

    // Load existing posts from localStorage
    const loadPosts = () => {
        const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        posts.forEach(post => {
            renderPost(post);
        });
    };

    // Render a single post to the DOM
    const renderPost = (post) => {
        const newPost = document.createElement('li');
        newPost.classList.add('forum-item');

        const newPostTitle = document.createElement('h3');
        const newPostLink = document.createElement('a');
        newPostLink.href = '#';
        newPostLink.textContent = post.title;
        newPostTitle.appendChild(newPostLink);

        const newPostContent = document.createElement('p');
        newPostContent.textContent = post.content;

        newPost.appendChild(newPostTitle);
        newPost.appendChild(newPostContent);

        generalDiscussionList.appendChild(newPost);
    };

    // Handle new post submission
    newPostForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        if (title.trim() === '' || content.trim() === '') {
            return;
        }

        const newPost = { title, content };

        // Save to localStorage
        const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        posts.push(newPost);
        localStorage.setItem('forumPosts', JSON.stringify(posts));

        // Render the new post
        renderPost(newPost);

        newPostForm.reset();
    });

    // Initial load of posts
    loadPosts();
});

// End of script
