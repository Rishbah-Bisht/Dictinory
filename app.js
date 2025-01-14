const searchBtn = document.querySelector('#serchBtn');
const container = document.querySelector('.container');

searchBtn.addEventListener('click', async () => {
    const welcomeMessage = document.querySelector('.welcome-message');
    welcomeMessage.style.display = 'none';

    const input = document.querySelector('#search').value;

    if (!input) {
        console.error('Please enter a word to search.');
        return;
    }

    const data = await getInfo(input);

    // Only show the container if the data is valid
    if (data && data[0]) {
        // Ensure the container is shown when valid data is present
        container.style.display = 'block';
        populateDictionary(data[0]);
    } else {
        alert('No data found for the given word.');
    }

});
const input = document.querySelector('#search');
const cross = document.querySelector('#cross');
cross.addEventListener('click', () => {
    input.value = '';
})


async function getInfo(input) {
    try {
        let res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`);
        return res.data;
    } catch (e) {
        console.error('Error fetching data:', e);
        alert('This word is not in our database, please refresh or try another word.');
    }
}

function populateDictionary(data) {
    if (!data) {
        console.error('Invalid data received.');
        return;
    }

    // Populate word data
    document.getElementById('word').textContent = data.word;

    const phoneticText = document.getElementById('phonetic-text');
    phoneticText.textContent = data.phonetics?.[1]?.text || 'N/A';

    // Populate audio for pronunciation if available
    const audio = document.getElementById('audio');
    if (data.phonetics && data.phonetics[1]?.audio) {
        audio.src = data.phonetics[1].audio;
    }

    // Clear previous meanings and add new ones
    const meaningsDiv = document.getElementById('meanings');
    meaningsDiv.innerHTML = ''; // Clear previous meanings

    data.meanings.forEach(meaning => {
        const section = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = meaning.partOfSpeech;
        section.appendChild(title);

        const list = document.createElement('ul');
        meaning.definitions.forEach(def => {
            const item = document.createElement('li');
            item.textContent = def.definition;

            // Append example if available
            if (def.example) {
                const example = document.createElement('p');
                example.style.fontStyle = 'italic';
                example.textContent = `Example: ${def.example}`;
                item.appendChild(example);
            }
            list.appendChild(item);
        });

        section.appendChild(list);
        meaningsDiv.appendChild(section);

        // Append synonyms and antonyms if available
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            const synonyms = document.createElement('p');
            synonyms.innerHTML = `<strong>Synonyms:</strong> ${meaning.synonyms.join(', ')}`;
            section.appendChild(synonyms);
        }

        if (meaning.antonyms && meaning.antonyms.length > 0) {
            const antonyms = document.createElement('p');
            antonyms.innerHTML = `<strong>Antonyms:</strong> ${meaning.antonyms.join(', ')}`;
            section.appendChild(antonyms);
        }
    });

    // Set source URL
    const sourceUrl = document.getElementById('source-url');
    sourceUrl.href = data.sourceUrls?.[0] || '#';
    sourceUrl.textContent = data.sourceUrls?.[0] || 'No source URL available';
}
