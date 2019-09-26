var words = ['word', 'guess', 'game', 'document'];

var game = {
  word: null,
  numberOfGuesses: 6,
  guessedLetters: [],
  wins: 0,
  sanitized: null,
  isDone: false,

  elements: {
    wordBox: document.getElementById('word-box'),
    remainsBox: document.getElementById('remain-box'),
    guessesBox: document.getElementById('guesses-box'),
    winsBox: document.getElementById('wins-box'),
    welcome: document.getElementById('welcome'),
    playAgain: document.getElementById('play-again'),
    doneText: document.getElementById('done-text'),
  },

  // Sets a new word on the game object.
  // Shuffles the contents of the words array.
  setNewWord: function () {
    words.sort(function (a, b) {
      return Math.random() - 0.5;
    });
    this.word = words[0]
  },

  // Updates the DOM with the current values of the game stats.
  updateGameScreen: function () {
    this.elements.wordBox.textContent = this.getHiddenWord();
    this.elements.remainsBox.textContent = this.numberOfGuesses;
    this.elements.guessesBox.textContent = this.guessedLetters;
    this.elements.winsBox.textContent = this.wins;

    if (this.guessedLetters.length > 0) {
      this.elements.welcome.classList.add('d-none');
    } else {
      this.elements.welcome.classList.remove('d-none');
    }

    if (this.isDone) {
      if (this.numberOfGuesses === 0) {
        this.elements.doneText.textContent = 'You have lost. Boo hoo.'
      } else {
        this.elements.doneText.textContent = 'CONGRATULATIONS YOU HAVE WON!!!';
      }
      this.elements.playAgain.classList.remove('d-none');
    } else {
      this.elements.playAgain.classList.add('d-none');
    }

  },

  // Generates the current word but with letters that haven't been guessed as underscores.
  getHiddenWord: function () {
    var hiddenWord = '';
    for (var index = 0; index < this.word.length; ++index) {
      var currentLetter = this.word[index];

      if (this.guessedLetters.includes(currentLetter)) {
        hiddenWord += currentLetter + ' '
      } else {
        hiddenWord += '_ ';
      }
    }
    return hiddenWord;
  },

  // Accepts a letter and stores its value to the game.
  // Stores the sanitized version of the letter in the game sanitized property.
  // Returns whether or not the letter was a correct guess.
  storeLetter: function (letter) {
    this.sanitized = letter.toLowerCase();

    if (!this.sanitized.match(/[a-z]/i) || this.isDone || this.guessedLetters.includes(this.sanitized)) {
      return false;
    }

    this.guessedLetters.push(this.sanitized);
    return true;
  },

  // Checks to see if the current word contains the passed letter.
  isCorrectGuess: function (letter) {
    return this.word.includes(letter);
  },

  // Updates the games guesses remaining values.
  updateGuessesRemaining: function () {
    if (!this.isCorrectGuess(this.sanitized)) {
      this.numberOfGuesses--;
    }
  },

  // Checks to see if the game has ended;
  checkForEndGame() {
    if (this.getHiddenWord().includes('_') && this.numberOfGuesses > 0) {
      return;
    }

    this.isDone = true;

    if (this.numberOfGuesses !== 0) {
      this.wins++;
    }
  },

  playAgain: function () {
    this.setNewWord();
    this.numberOfGuesses = 6;
    this.guessedLetters = [];
    this.sanitized = null;
    this.isDone = false;
    this.updateGameScreen();
  },
}

game.playAgain();

document.onkeypress = function (event) {

  if (!game.storeLetter(event.key)) {
    return;
  };

  game.updateGuessesRemaining();

  game.checkForEndGame();

  game.updateGameScreen();
}

document.getElementById('play-again').onclick = function () {
  game.playAgain();
}

document.getElementById('cancel').onclick = function () {
  window.close()
}