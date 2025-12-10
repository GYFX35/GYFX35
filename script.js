document.addEventListener('DOMContentLoaded', () => {
    const newPostForm = document.getElementById('new-post-form');
    const postsContainer = document.getElementById('posts-container');

    const getPosts = () => {
        const posts = localStorage.getItem('posts');
        return posts ? JSON.parse(posts) : [];
    };

    const savePosts = (posts) => {
        localStorage.setItem('posts', JSON.stringify(posts));
    };

    const renderPosts = () => {
        postsContainer.innerHTML = '';
        const posts = getPosts();
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
            `;
            postsContainer.appendChild(postElement);
        });
    };

    newPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('post-title');
        const contentInput = document.getElementById('post-content');

        const newPost = {
            title: titleInput.value,
            content: contentInput.value,
        };

        const posts = getPosts();
        posts.push(newPost);
        savePosts(posts);

        titleInput.value = '';
        contentInput.value = '';

        renderPosts();
    });

    renderPosts();
});
