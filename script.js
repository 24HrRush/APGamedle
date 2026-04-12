let gameIsActive = true;
let lives = 10;
let correctCategories = [];

let gameList = [];

document.getElementById("gameScreen").style.display = "none";

// Load data from the JSON file
fetch('games_info.json')
    .then(response => {
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Update the mangaList with data from the JSON file
        gameList = data;
        // Initialize the game after loading the data
        window.addEventListener("keyup", ev => {
  if (ev.key === "ArrowUp") {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    initGame();
  }
});
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });


    function initGame() {
    populateDataList();
    resetGame();
}


function displayLives() {
  const livesElement = document.getElementById("lives");
  let hearts = '';
  for (let i = 0; i < lives; i++) {
    hearts += '❤️';
  }
  for (let i = 0; i < (10 - lives); i++) {
    hearts += '🤍';
  }
  livesElement.innerHTML = hearts;
}

displayLives();


function populateDataList() {
  const dataList = document.getElementById("game-titles");
  
  gameList.forEach(game => {
    const option = document.createElement("option");
    option.value = game.name;
    dataList.appendChild(option);
  });
}

populateDataList();

function getRandomGame() {
  const randomIndex = Math.floor(Math.random() * gameList.length);
  return gameList[randomIndex];
}

let gameToGuess = getRandomGame();

function resetGame() {
  gameIsActive = true;
  gameToGuess = getRandomGame();  // Generate a new manga to guess
  
  const input = document.getElementById("guess");
  const guessButton = document.getElementById("guessButton");
  
  input.disabled = false;
  guessButton.disabled = false;
  
  lives = 10;  // Reset lives
  displayLives();  // Update displayed lives
  
  // Clear the previous game's information table
  const tableBody = document.getElementById("infoTable").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = "";
}

function giveHint() {
  if (!gameIsActive) return; // Don't provide hints if the game is over

  // Hide the button
  document.getElementById("hintButton").style.display = "none";
  
  // Calculate the list of categories that have not been guessed correctly yet
  const unguessedCategories = Object.keys(gameToGuess).filter(category => {
    return !correctCategories.includes(category) && category !== 'name';
  });
  
  // Pick a random unguessed category to provide a hint for
  const randomCategoryIndex = Math.floor(Math.random() * unguessedCategories.length);
  const hintCategory = unguessedCategories[randomCategoryIndex];
  
  // Provide a hint based on the category
  const tableBody = document.getElementById("infoTable").getElementsByTagName('tbody')[0];
  const newRow = tableBody.insertRow();
  
  Object.keys(gameToGuess).forEach((key, i) => {
    const cell = newRow.insertCell(i);
    if (key === hintCategory) {
      cell.innerText = gameToGuess[hintCategory];
      cell.style.backgroundColor = 'green'; // You can choose another color for hints
    } else {
      cell.innerText = " "; // Empty cell for all other categories
      cell.style.backgroundColor = 'red'
    }
  });
}

function checkGuess() {
  if (!gameIsActive) return;

  const input = document.getElementById("guess");
  const guessButton = document.getElementById("guessButton");
  const guess = input.value.toLowerCase();

  const validTitles = gameList.map(game => game.name.toLowerCase());
  if (!validTitles.includes(guess)) {
    alert("Please enter a valid title from the list");
    return;
  }

  const guessedGame = gameList.find(game => game.name.toLowerCase() === guess);
  const tableBody = document.getElementById("infoTable").getElementsByTagName('tbody')[0];
  const newRow = tableBody.insertRow();

  Object.keys(gameToGuess).forEach((key, i) => {
    const cell = newRow.insertCell(i);
    cell.innerText = guessedGame[key];

    // Special handling for each category
    if (key === 'first_release_date') {
      const correctYear = parseInt(gameToGuess[key]);
      const guessedYear = parseInt(guessedGame[key]);
            
      if (guessedYear === correctYear) {
        cell.style.backgroundColor = 'green';
      } else if (typeof guessedYear === "number" && typeof correctYear === "number") {
        const diff = guessedYear - correctYear;
        if (Math.abs(diff) <= 5) {
          cell.style.backgroundColor = 'yellow';
          cell.innerHTML += ` ${diff < 0 ? '&#9650;' : '&#9660;'}`;
        } else {
          cell.style.backgroundColor = 'red';
          cell.innerHTML += ` ${diff < 0 ? '&#9650;' : '&#9660;'}`;
        }
      } else {
        cell.style.backgroundColor = 'red';
      }
      return;
    }
    
    if (key === 'genres') {
      const correctGenres = gameToGuess.genres.map(g => g.name).join(", ");
      const guessedGenres = guessedGame.genres.map(g => g.name).join(", ");
  
      const intersection = guessedGenres.filter(g => correctGenres.includes(g));
      
      if (intersection.length === guessedGenres.length && guessedGenres.length === correctGenres.length) {
          cell.style.backgroundColor = 'green';
      } else if (intersection.length > 0) {
          cell.style.backgroundColor = 'yellow';
      } else {
          cell.style.backgroundColor = 'red';
      }
      return;
    }
  
    if (guessedGame[key] === gameToGuess[key]) {
      cell.style.backgroundColor = 'green';
      // Add the category to the list of correct categories if it's not already there
      if (!correctCategories.includes(key)) {
        correctCategories.push(key);
      }
    } else {
      cell.style.backgroundColor = 'red';
    }
  });

  if (guess === gameToGuess.name.toLowerCase()) {
    setTimeout(function() {
      alert("Congratulations! You've guessed the manga!");
      gameIsActive = false;
      input.disabled = true;
      guessButton.disabled = true;
      // Optionally reset the game or proceed to the next round
    }, 300);
  } else {
    lives--;
    displayLives();

    if (lives <= 0) {
      setTimeout(function() {
        alert("Game over!The game was " + gameToGuess.name);
        gameIsActive = false;
        input.disabled = true;
        guessButton.disabled = true;
      }, 300);
    }
  }
  input.value = "";
}

window.onload = function () {
  // This is now empty because initGame is called after loading the data
};


resetGame();
