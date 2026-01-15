document.addEventListener('DOMContentLoaded', () => {
    const newPostForm = document.getElementById('new-post-form');
    const generalDiscussionList = document.getElementById('general-discussion-list');
    const galleryContainer = document.querySelector('.gallery-container');
    const videoSubmissionForm = document.getElementById('video-submission-form');

    async function fetchPosts() {
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            generalDiscussionList.innerHTML = '<p>Could not fetch posts. Please try again later.</p>';
        }
    }

    function renderPosts(posts) {
        generalDiscussionList.innerHTML = ''; // Clear existing posts
        if (!posts || posts.length === 0) {
            generalDiscussionList.innerHTML = '<p>No posts have been submitted yet.</p>';
            return;
        }
        posts.forEach(post => {
            const postElement = document.createElement('li');
            postElement.classList.add('forum-item');
            postElement.innerHTML = `
                <h3><a href="#">${post.title}</a></h3>
                <p>${post.content}</p>
            `;
            generalDiscussionList.appendChild(postElement);
        });
    }

    newPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;

        const submissionData = { title, content };

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const statusMessage = document.getElementById('status-message');
            if (response.ok) {
                statusMessage.textContent = 'Post submitted successfully!';
                statusMessage.style.color = 'green';
                newPostForm.reset();
                fetchPosts(); // Refresh the post list
            } else {
                const errorData = await response.json();
                statusMessage.textContent = `Submission failed: ${errorData.message}`;
                statusMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error submitting post:', error);
            const statusMessage = document.getElementById('status-message');
            statusMessage.textContent = 'An error occurred while submitting the post.';
            statusMessage.style.color = 'red';
        }
    });

    fetchPosts();

    function getEmbedUrl(url) {
        let embedUrl = url;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com' || urlObj.hostname === 'youtu.be') {
                let videoId;
                if (urlObj.hostname === 'youtu.be') {
                    videoId = urlObj.pathname.slice(1);
                } else {
                    videoId = urlObj.searchParams.get('v');
                }
                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }
            }
        } catch (error) {
            console.error('Invalid video URL:', url, error);
            return null;
        }
        return embedUrl;
    }

    function renderVideos(videos) {
        galleryContainer.innerHTML = '';
        if (!videos || videos.length === 0) {
            galleryContainer.innerHTML = '<p>No videos have been submitted yet.</p>';
            return;
        }
        videos.forEach(video => {
            const embedUrl = getEmbedUrl(video.url);
            if (!embedUrl) return;

            const videoElement = document.createElement('div');
            videoElement.classList.add('video-item');
            videoElement.innerHTML = `
                <h3>${video.title}</h3>
                <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <p>${video.description}</p>
            `;
            galleryContainer.appendChild(videoElement);
        });
    }

    async function fetchVideos() {
        try {
            const response = await fetch('/api/videos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const videos = await response.json();
            renderVideos(videos);
        } catch (error) {
            console.error('Error fetching videos:', error);
            galleryContainer.innerHTML = '<p>Could not fetch videos. Please try again later.</p>';
        }
    }

    videoSubmissionForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('video-title').value;
        const url = document.getElementById('video-url').value;
        const description = document.getElementById('video-description').value;

        const submissionData = { title, url, description };

        try {
            const response = await fetch('/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const statusMessage = document.getElementById('video-status-message');
            if (response.ok) {
                statusMessage.textContent = 'Video submitted successfully!';
                statusMessage.style.color = 'green';
                videoSubmissionForm.reset();
                fetchVideos();
            } else {
                const errorData = await response.json();
                statusMessage.textContent = `Submission failed: ${errorData.message}`;
                statusMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error submitting video:', error);
            const statusMessage = document.getElementById('video-status-message');
            statusMessage.textContent = 'An error occurred while submitting the video.';
            statusMessage.style.color = 'red';
        }
    });

    fetchVideos();
});
