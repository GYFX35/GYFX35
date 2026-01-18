document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery-container');
    const submissionForm = document.getElementById('video-submission-form');

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
            // Add more providers as needed
        } catch (error) {
            console.error('Invalid video URL:', url, error);
            return null;
        }
        return embedUrl;
    }

    function renderVideos(videos) {
        galleryContainer.innerHTML = ''; // Clear existing videos
        if (!videos || videos.length === 0) {
            galleryContainer.innerHTML = '<p>No videos have been submitted yet.</p>';
            return;
        }
        videos.forEach(video => {
            if (!video.thumbnail || !video.url) return;

            const videoElement = document.createElement('div');
            videoElement.classList.add('video-preview');

            // Create a link that wraps the thumbnail and title
            const videoLink = document.createElement('a');
            videoLink.href = video.url;
            videoLink.target = '_blank'; // Open in a new tab
            videoLink.rel = 'noopener noreferrer';

            videoLink.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" style="width:100%; height:auto;">
                <h3>${video.title}</h3>
            `;

            videoElement.appendChild(videoLink);
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

    submissionForm.addEventListener('submit', async (event) => {
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

            if (response.ok) {
                alert('Video submitted successfully!');
                submissionForm.reset();
                fetchVideos(); // Refresh the video list
            } else {
                const errorData = await response.json();
                alert(`Submission failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting video:', error);
            alert('An error occurred while submitting the video.');
        }
    });

    // Initial fetch of videos when the page loads
    fetchVideos();
});
