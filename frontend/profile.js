document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const useCameraBtn = document.getElementById('use-camera');
    const captureBtn = document.getElementById('capture');
    const cameraStream = document.getElementById('camera-stream');
    const profilePic = document.getElementById('profile-pic');
    const canvas = document.getElementById('canvas');
    let stream;

    useCameraBtn.addEventListener('click', async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                cameraStream.srcObject = stream;
                cameraStream.style.display = 'block';
                profilePic.style.display = 'none';
                useCameraBtn.style.display = 'none';
                captureBtn.style.display = 'block';
            } catch (error) {
                console.error('Error accessing camera:', error);
                alert('Could not access the camera. Please check your browser permissions.');
            }
        } else {
            alert('Your browser does not support camera access.');
        }
    });

    captureBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = cameraStream.videoWidth;
        canvas.height = cameraStream.videoHeight;
        context.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        profilePic.src = dataUrl;

        stream.getTracks().forEach(track => track.stop());
        cameraStream.style.display = 'none';
        captureBtn.style.display = 'none';
        profilePic.style.display = 'block';
        useCameraBtn.style.display = 'block';
    });

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
