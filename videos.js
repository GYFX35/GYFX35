document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('video-player');
    const videoGallery = document.getElementById('video-gallery');
    const videoSubmissionForm = document.getElementById('video-submission-form');

    const mockVideos = [
        {
            title: 'Global Peace',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            thumbnail: 'https://via.placeholder.com/200x150.png?text=Global+Peace',
            description: 'A video about global peace initiatives.'
        },
        {
            title: 'Youth Entrepreneurship',
            url: 'https://www.w3schools.com/html/movie.mp4',
            thumbnail: 'https://via.placeholder.com/200x150.png?text=Youth+Entrepreneurship',
            description: 'A video about youth entrepreneurship programs.'
        }
    ];

    function populateVideoGallery() {
        videoGallery.innerHTML = '';
        mockVideos.forEach(video => {
            const thumbnail = document.createElement('div');
            thumbnail.classList.add('video-thumbnail');
            thumbnail.innerHTML = `<img src="${video.thumbnail}" alt="${video.title}">`;
            thumbnail.addEventListener('click', () => {
                videoPlayer.src = video.url;
                videoPlayer.play();
            });
            videoGallery.appendChild(thumbnail);
        });
    }

    /*
    videoSubmissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('video-title').value;
        const url = document.getElementById('video-url').value;
        const description = document.getElementById('video-description').value;
        console.log('New video submitted:', { title, url, description });
        videoSubmissionForm.reset();
    });
    */

    populateVideoGallery();
});
