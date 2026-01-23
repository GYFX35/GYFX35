document.addEventListener('DOMContentLoaded', () => {
    const successStoriesContainer = document.getElementById('success-stories-container');
    if (successStoriesContainer) {
        successStoriesContainer.innerHTML = '<p>Loading success stories...</p>';
        fetchSuccessStories();
    }

    const programsContainer = document.getElementById('programs-container');
    if (programsContainer) {
        programsContainer.innerHTML = '<p>Loading programs...</p>';
        fetchPrograms();
    }
});

async function fetchPrograms() {
    const programSlugs = ['construye-tu-futuro', 'in-valencia', 'programa-de-incubacion-digital-andalucia'];
    let programs = [];

    for (const slug of programSlugs) {
        try {
            const response = await fetch(`/api/cvalores/pages?slug=${slug}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.length > 0) {
                const page = data[0];
                const program = parseProgram(page);
                if(program.title && program.description) {
                    programs.push(program);
                }
            }
        } catch (error) {
            console.error(`Could not fetch program ${slug}:`, error);
        }
    }

    displayPrograms(programs);
}

function parseProgram(page) {
    const title = page.title.rendered;
    const description = page.excerpt.rendered ? page.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim() : 'No description available.';
    return { title, description };
}

function displayPrograms(programs) {
    const programsContainer = document.getElementById('programs-container');
    if (programs.length > 0) {
        programsContainer.innerHTML = ''; // Clear loading message
        programs.forEach(program => {
            const programElement = document.createElement('div');
            programElement.className = 'program';

            const titleElement = document.createElement('h3');
            titleElement.textContent = program.title;
            programElement.appendChild(titleElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = program.description;
            programElement.appendChild(descriptionElement);

            programsContainer.appendChild(programElement);
        });
    } else {
        programsContainer.innerHTML = '<p>No programs found at the moment.</p>';
    }
}

async function fetchSuccessStories() {
    const pageIds = [14727, 14718, 14391];
    let stories = [];

    for (const id of pageIds) {
        try {
            const response = await fetch(`/api/cvalores/pages/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const page = await response.json();
            const newStories = parseSuccessStories(page.content.rendered);
            stories = stories.concat(newStories);
        } catch (error) {
            console.error(`Could not fetch success stories from page ${id}:`, error);
        }
    }

    displaySuccessStories(stories);
}

function parseSuccessStories(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const testimonials = doc.querySelectorAll('.elementor-testimonial__text');
    const stories = [];
    testimonials.forEach(testimonial => {
        stories.push(testimonial.innerText.trim());
    });
    return stories;
}

function displaySuccessStories(stories) {
    const successStoriesContainer = document.getElementById('success-stories-container');
    if (stories.length > 0) {
        successStoriesContainer.innerHTML = ''; // Clear loading message
        stories.forEach(story => {
            const storyElement = document.createElement('blockquote');
            storyElement.className = 'success-story';
            storyElement.textContent = `"${story}"`;
            successStoriesContainer.appendChild(storyElement);
        });
    } else {
        successStoriesContainer.innerHTML = '<p>No success stories found at the moment.</p>';
    }
}
