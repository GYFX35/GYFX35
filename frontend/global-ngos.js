document.addEventListener('DOMContentLoaded', () => {
    console.log('Global NGOs page loaded');
    setupSections();
    fetchJobData();
    fetchOpportunities('education-section', 'EDUCATION');
    fetchOpportunities('health-section', 'HEALTH');
});

function setupSections() {
    const container = document.getElementById('ngos-container');
    container.innerHTML = `
        <div id="jobs-section" class="ngo-card"><h2>Jobs</h2></div>
        <div id="education-section" class="ngo-card"><h2>Education</h2></div>
        <div id="health-section" class="ngo-card"><h2>Health</h2></div>
    `;
}

async function fetchJobData() {
    const jobsSection = document.getElementById('jobs-section');
    jobsSection.innerHTML += '<p>Loading...</p>';
    try {
        const response = await fetch(`/api/candid/news/v1/search?q=job`);
        const data = await response.json();
        jobsSection.querySelector('p').remove(); // Remove loading indicator
        if (!response.ok) {
            if (data.error === 'Candid API key not configured') {
                jobsSection.innerHTML += '<p>The Candid API key is not configured. Please add it to proceed.</p>';
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }

        const list = document.createElement('ul');
        if (data.hits && data.hits.length > 0) {
            data.hits.slice(0, 10).forEach(article => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = article.url;
                link.textContent = article.title;
                link.target = '_blank';
                listItem.appendChild(link);
                list.appendChild(listItem);
            });
            jobsSection.appendChild(list);
        } else {
            jobsSection.innerHTML += '<p>No job opportunities found.</p>';
        }
    } catch (error) {
        console.error('Error fetching job data:', error);
        jobsSection.querySelector('p').remove(); // Remove loading indicator
        jobsSection.innerHTML += '<p>Could not fetch job data.</p>';
    }
}

async function fetchOpportunities(sectionId, areaOfFocus) {
    const section = document.getElementById(sectionId);
    section.innerHTML += '<p>Loading...</p>';
    try {
        const response = await fetch(`/api/idealist/v1/listings/volops?areasOfFocus=${areaOfFocus}`);
        const loadingIndicator = section.querySelector('p');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        if (!response.ok) {
            if (response.status === 401) {
                section.innerHTML += `<p>The Idealist API key is not configured or is invalid.</p>`;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }

        const data = await response.json();
        const list = document.createElement('ul');
        if (data.volops && data.volops.length > 0) {
            data.volops.slice(0, 10).forEach(opp => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = opp.url.en;
                link.textContent = opp.name;
                link.target = '_blank';
                listItem.appendChild(link);
                list.appendChild(listItem);
            });
            section.appendChild(list);
        } else {
            section.innerHTML += `<p>No volunteer opportunities found for ${areaOfFocus.toLowerCase()}.</p>`;
        }
    } catch (error) {
        console.error(`Error fetching ${areaOfFocus} opportunities:`, error);
        section.querySelector('p').remove(); // Remove loading indicator
        section.innerHTML += `<p>Could not fetch ${areaOfFocus.toLowerCase()} opportunities.</p>`;
    }
}
