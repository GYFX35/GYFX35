// frontend/media.js

/**
 * Requests access to the user's camera and returns a MediaStream object.
 * @param {HTMLVideoElement} videoElement - The video element to display the camera stream.
 * @returns {Promise<MediaStream>} - A promise that resolves with the MediaStream object.
 */
export async function getCameraStream(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        videoElement.style.display = 'block';
        return stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        throw new Error('Could not access the camera. Please check your browser permissions.');
    }
}

/**
 * Captures a photo from a video stream and returns it as a data URL.
 * @param {HTMLVideoElement} videoElement - The video element displaying the camera stream.
 * @param {HTMLCanvasElement} canvasElement - The canvas element to draw the photo on.
 * @returns {string} - The data URL of the captured photo.
 */
export function capturePhoto(videoElement, canvasElement) {
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    return canvasElement.toDataURL('image/png');
}

/**
 * Starts recording a video from a MediaStream.
 * @param {MediaStream} stream - The MediaStream to record.
 * @param {function(Blob): void} onStopCallback - A callback that receives the video blob when recording stops.
 * @returns {MediaRecorder} - The MediaRecorder instance.
 */
export function startRecording(stream, onStopCallback) {
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        if (onStopCallback) {
            onStopCallback(blob);
        }
    };

    mediaRecorder.start();
    return mediaRecorder;
}

/**
 * Stops a video recording.
 * @param {MediaRecorder} mediaRecorder - The MediaRecorder instance to stop.
 */
export function stopRecording(mediaRecorder) {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

/**
 * Uploads a media file to the server.
 * @param {Blob} mediaBlob - The media file to upload.
 * @param {string} fileName - The name of the file.
 * @param {function(): void} onUploadComplete - A callback to execute after a successful upload.
 */
export async function uploadMedia(mediaBlob, fileName, onUploadComplete) {
    const formData = new FormData();
    formData.append('media', mediaBlob, fileName);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Upload successful:', result);
            if (onUploadComplete) {
                onUploadComplete();
            }
        } else {
            const error = await response.json();
            console.error('Upload failed:', error.message);
        }
    } catch (error) {
        console.error('Error uploading media:', error);
    }
}
