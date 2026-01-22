document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cisco/webex/meetings')
        .then(response => response.json())
        .then(data => {
            console.log('Webex data:', data);
            const webexContainer = document.getElementById('webex-data');
            webexContainer.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error fetching Webex data:', error);
            const webexContainer = document.getElementById('webex-data');
            webexContainer.innerHTML += `<p>Error fetching Webex data.</p>`;
        });

    fetch('/api/cisco/meraki/organizations')
        .then(response => response.json())
        .then(data => {
            console.log('Meraki data:', data);
            const merakiContainer = document.getElementById('meraki-data');
            merakiContainer.innerHTML += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('Error fetching Meraki data:', error);
            const merakiContainer = document.getElementById('meraki-data');
            merakiContainer.innerHTML += `<p>Error fetching Meraki data.</p>`;
        });
});
