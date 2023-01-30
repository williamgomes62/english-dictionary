const API_PATCH = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

class Dictionary {
  constructor() {
    this.onFetchData = this.onFetchData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onError = this.onError.bind(this);
    this.disableLoading = this.disableLoading.bind(this);
    this.errorMessage = this.errorMessage.bind(this);
    const submitButton = document.querySelector('button');
    submitButton.addEventListener('click', this.onSubmit);
    document.body.addEventListener('keypress', (event) => {
      if (event.keyCode === 13) this.onSubmit();
    });
  }

  onSubmit(event) {

    const input = document.querySelector('#input-text');
    if (input.value.length === 0) {
      console.log(input.value.length)
      alert('Please fill in the search field');
      input.focus();
      return;
    }

    const container = document.querySelector('#container');
    container.innerHTML = '';

    if (document.querySelector('a') === null) {
      const body = document.querySelector('#root');
      const loadingAnimation = document.createElement('a');
      const loadingText = document.createElement('h5');
      loadingText.textContent = 'loading...';
      body.appendChild(loadingAnimation);
      body.appendChild(loadingText);
    }

    event.preventDefault();
    const textInput = document.querySelector('#input-text');
    const query = encodeURIComponent(textInput.value);

    fetch(API_PATCH + query)
      .then(this.onLoading)
      .then(this.onFetchData, this.onError);
  }

  errorMessage() {
    const container = document.querySelector('#container');
    const title = document.createElement('h4');
    const message = document.createElement('h5');
    const resolution = document.createElement('h5');

    title.textContent = "No Definitions Found";
    message.textContent = "Sorry pal, we couldn't find definitions for the word you were looking for.";
    resolution.textContent = "You can try the search again at later time or head to the web instead.";

    container.appendChild(title);
    container.appendChild(message);
    container.appendChild(resolution);
  }

  onError() {
    this.disableLoading();
    this.errorMessage();
  }

  disableLoading() {
    const body = document.querySelector('#root');
    const loadingAnimation = document.querySelector('a');
    const loadingText = document.querySelector('h5');
    body.removeChild(loadingAnimation);
    body.removeChild(loadingText);
  }

  onLoading(response) {

    if (response.status === 404) {
      this.disableLoading();
      this.errorMessage();

      return [];
    }
    return response.json();
  }

  onFetchData(response) {

    if (document.querySelector('a') === null) {
      return;
    }

    const body = document.querySelector('#root');

    this.disableLoading();

    const container = document.querySelector('#container');
    container.innerHTML = '';

    const wordList = document.createElement('ol');

    response.map(data => {
      const wordItem = document.createElement('li');

      const word = document.createElement('h2');
      word.textContent = data.word;
      const origin = document.createElement('p');
      origin.textContent = data.origin;

      wordItem.appendChild(word);
      wordItem.appendChild(origin);

      const phonetic = document.createElement('h4');

      if (data.phonetics[0].hasOwnProperty('audio')) {
        phonetic.textContent = 'Phonetic:';
        const phoneticAudio = document.createElement('audio');
        //phoneticAudio.autoplay = "autoplay";
        phoneticAudio.controls = "controls";
        const audioSource = document.createElement('source');
        audioSource.src = data.phonetics[0].audio;
        phoneticAudio.appendChild(audioSource);

        wordItem.appendChild(phonetic);
        wordItem.appendChild(phoneticAudio);
      }
      else {
        phonetic.textContent = 'Phonetic: indisponible';
        wordItem.appendChild(phonetic);
      }

      const meanings = document.createElement('h3');
      meanings.textContent = 'Meanings';
      wordItem.appendChild(meanings);

      const meaningsSection = document.createElement('section');

      data.meanings.map(meaning => {
        const partOfSpeech = document.createElement('i');
        partOfSpeech.textContent = meaning.partOfSpeech;

        const definitionsList = document.createElement('ol');
        meaning.definitions.map(item => {
          const text = document.createElement('li');
          text.textContent = item.definition;
          definitionsList.appendChild(text);
        })
        meaningsSection.appendChild(partOfSpeech);
        meaningsSection.appendChild(definitionsList);
      });
      wordItem.appendChild(meaningsSection);

      const divider = document.createElement('hr');
      divider.width = '100%';
      wordItem.appendChild(divider);

      wordList.appendChild(wordItem);
    });
    container.appendChild(wordList);
  }
}

const dic = new Dictionary();