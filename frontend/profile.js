import { getCameraStream, capturePhoto, startRecording, stopRecording, uploadMedia } from './media.js';

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const useCameraBtn = document.getElementById('use-camera');
    const capturePhotoBtn = document.getElementById('capture-photo');
    const startRecordBtn = document.getElementById('start-record');
    const stopRecordBtn = document.getElementById('stop-record');
    const cameraStreamEl = document.getElementById('camera-stream');
    const profilePic = document.getElementById('profile-pic');
    const canvas = document.getElementById('canvas');
    const galleryContainer = document.querySelector('#media-gallery .gallery-container');
    let stream;
    let mediaRecorder;

    useCameraBtn.addEventListener('click', async () => {
        try {
            stream = await getCameraStream(cameraStreamEl);
            profilePic.style.display = 'none';
            useCameraBtn.style.display = 'none';
            capturePhotoBtn.style.display = 'block';
            startRecordBtn.style.display = 'block';
        } catch (error) {
            alert(error.message);
        }
    });

    capturePhotoBtn.addEventListener('click', () => {
        const dataUrl = capturePhoto(cameraStreamEl, canvas);
        profilePic.src = dataUrl;

        // Convert data URL to Blob for upload
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                uploadMedia(blob, 'photo.png', fetchMedia);
            });

        stopStream();
    });

    startRecordBtn.addEventListener('click', () => {
        mediaRecorder = startRecording(stream, (videoBlob) => {
            uploadMedia(videoBlob, 'video.webm', fetchMedia);
        });
        startRecordBtn.style.display = 'none';
        stopRecordBtn.style.display = 'block';
    });

    stopRecordBtn.addEventListener('click', () => {
        stopRecording(mediaRecorder);
        stopStream();
        stopRecordBtn.style.display = 'none';
    });

    function stopStream() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        cameraStreamEl.style.display = 'none';
        capturePhotoBtn.style.display = 'none';
        startRecordBtn.style.display = 'none';
        profilePic.style.display = 'block';
        useCameraBtn.style.display = 'block';
    }

    async function fetchMedia() {
        try {
            const response = await fetch('/api/media');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const mediaFiles = await response.json();
            renderMediaGallery(mediaFiles);
        } catch (error) {
            console.error('Error fetching media:', error);
            galleryContainer.innerHTML = '<p>Could not fetch media. Please try again later.</p>';
        }
    }

    function renderMediaGallery(mediaFiles) {
        galleryContainer.innerHTML = '';
        if (!mediaFiles || mediaFiles.length === 0) {
            galleryContainer.innerHTML = '<p>No media has been uploaded yet.</p>';
            return;
        }
        mediaFiles.forEach(file => {
            const mediaElement = document.createElement('div');
            mediaElement.classList.add('media-item');
            if (file.type.startsWith('image/')) {
                mediaElement.innerHTML = `<img src="/uploads/${file.filename}" alt="User media">`;
            } else if (file.type.startsWith('video/')) {
                mediaElement.innerHTML = `<video src="/uploads/${file.filename}" controls></video>`;
            }
            galleryContainer.appendChild(mediaElement);
        });
    }

    // Initial fetch of media when the page loads
    fetchMedia();

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const bio = document.getElementById('bio').value;
        const profilePicture = profilePic.src;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, bio, profilePicture }),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Account created successfully!');
                // Optionally, redirect to a different page or clear the form
                profileForm.reset();
                profilePic.src = 'https://via.placeholder.com/150'; // Reset to a placeholder
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Something went wrong.'}`);
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert('An error occurred while creating the account.');
        }
    });
});
