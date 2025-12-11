const cameraButton = document.getElementById('camera-button');
const cameraStream = document.getElementById('camera-stream');

cameraButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});

const shareButtons = document.querySelectorAll('.share-button');

shareButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const network = button.dataset.network;
        const url = window.location.href;
        const text = "Join the movement for Global Peace, Youth Entrepreneurship, and Wellbeing!";
        let shareUrl;

        switch (network) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
                break;
        }

        window.open(shareUrl, 'Share', 'width=600,height=400');
    });
});

// Crowdfunding progress bar
function updateProgressBar() {
    const amountRaisedEl = document.getElementById('amount-raised');
    const goalAmountEl = document.getElementById('goal-amount');
    const progressBar = document.getElementById('crowdfunding-progress');

    // Get the numerical values from the text content
    const amountRaised = parseFloat(amountRaisedEl.textContent.replace('$', '').replace(',', ''));
    const goalAmount = parseFloat(goalAmountEl.textContent.replace('$', '').replace(',', ''));

    if (!isNaN(amountRaised) && !isNaN(goalAmount) && goalAmount > 0) {
        const percentage = (amountRaised / goalAmount) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Update the progress bar when the page loads
document.addEventListener('DOMContentLoaded', updateProgressBar);
