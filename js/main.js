document.addEventListener('DOMContentLoaded', () => {
  // generate squares on start
  createSquares();

  // initialize array for inside array for guesses
  let guessedWords = [
    []
  ];

  // start available space at 1, increment later to keep track
  let availableSpace = 1;
  let word = wordList[Math.floor(Math.random() * wordList.length)];
  console.log(word);
  let guessedWordCount = 0;

  const keys = document.querySelectorAll('.keyboard-row button');

  function getCurrentWordArray() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArray = getCurrentWordArray();

    if (currentWordArray && currentWordArray.length < 5) {
      currentWordArray.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));

      availableSpace = availableSpace + 1;

      availableSpaceEl.textContent = letter;
    }
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArray();
    if (currentWordArr.length !== 5) {
      popUpHandler('Dumbass');
      return;
    }

    const currentWord = currentWordArr.join('');

    fetch(`https://wordsapiv1.p.rapidapi.com/words/${currentWord}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
          'x-rapidapi-key': 'da58be763amsh6ac5e2c87cd7f6bp1177bdjsnfa40316c51da'
        }
      })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const tileColor = getTileColor(letter, index);

            const letterId = firstLetterId + index;
            const letterEl = document.getElementById(letterId);
            letterEl.classList.add('animate__flipInX');
            letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            changeKeyColor(letter, tileColor);
          }, interval * index);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
          popUpHandler('Well done!');
        }

        if (guessedWords.length === 6 && currentWord !== word) {
          popUpHandler(word);
        }

        guessedWords.push([]);
      })
      .catch(() => {
        popUpHandler('Not in word list!');
      });
  }

  function changeKeyColor(letter, tileColor) {
    const key = document.getElementById(`${letter}`);
    key.style = `background-color:${tileColor};border-color:${tileColor}`;
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return 'rgb(58, 58, 60)';
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return 'rgb(83, 141, 78)';
    }

    return 'rgb(181, 159, 59)';
  }

  function handleDeleteLetter() {
    const currentWordArray = getCurrentWordArray();
    const removeLetter = currentWordArray.pop();

    guessedWords[guessedWords.length - 1] = currentWordArray;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = '';
    availableSpace = availableSpace - 1;
  }

  function popUpHandler(string) {
    const popUp = document.getElementById('alertbox');

    document.getElementById('string').innerHTML = string;

    popUp.classList.remove('hidden');
    popUp.classList.add('spinBabySpin');
    console.log('Class hidden removed');
    setTimeout(() => {
      popUp.classList.add('hidden');
      popUp.classList.remove('spinBabySpin');
    }, 2000);
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute('data-key');

      if (letter === 'enter') {
        handleSubmitWord();
        return;
      }

      if (letter === 'del') {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(letter);
    };
  }
});
