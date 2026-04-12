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
        window.addEventListener("click", ev => {
  if (ev.target.id === "myButton") {
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
  gameToGuess = getRandomGame();  // Generate a new game to guess
  
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
    return !correctCategories.includes(category) && category !== 'name' && category !== 'rating' && category !== 'id' && category !== 'cover';
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
      if (hintCategory === 'genres') {
  cell.innerText = gameToGuess.genres.map(g => g.name).join(", ");
} 
else if (hintCategory === 'platforms') {
  cell.innerText = gameToGuess.platforms.map(p => p.name).join(", ");
} 
else if (hintCategory === 'involved_companies') {
  cell.innerText = gameToGuess.involved_companies.map(c => c.company.name).join(", ");
}
else if (hintCategory === 'categories') {
  cell.innerText = gameToGuess.categories.map(c => c.name).join(", ");
}
else {
  cell.innerText = gameToGuess[hintCategory];
}
      cell.style.backgroundColor = '#77DD77'; // You can choose another color for hints
    } else {
      cell.innerText = " "; // Empty cell for all other categories
      cell.style.backgroundColor = '#FF6961'
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
    // Handle display values first
if (key === 'genres') {
  cell.innerText = guessedGame.genres.map(g => g.name).join(", ");
} 
else if (key === 'platforms') {
  cell.innerText = guessedGame.platforms.map(p => p.name).join(", ");
} 
else if (key === 'involved_companies') {
  cell.innerText = guessedGame.involved_companies.map(c => c.company.name).join(", ");
}
else if (key === 'cover') {
  if (guessedGame.cover?.url) {
    const url = "https:" + guessedGame.cover.url;
    cell.innerHTML = `<img src="${url}" alt="cover">`;
  } else {
    cell.innerText = "No cover";
  }
}
else {
  cell.innerText = guessedGame[key];
}

    // Special handling for each category
    if (key === 'first_release_date') {
      const correctYear = parseInt(gameToGuess[key]);
      const guessedYear = parseInt(guessedGame[key]);
            
      if (guessedYear === correctYear) {
        cell.style.backgroundColor = '#77DD77';
      } else if (typeof guessedYear === "number" && typeof correctYear === "number") {
        const diff = guessedYear - correctYear;
        if (Math.abs(diff) <= 5) {
          cell.style.backgroundColor = '#FBB124';
          cell.innerHTML += ` ${diff < 0 ? '&#9650;' : '&#9660;'}`;
        } else {
          cell.style.backgroundColor = '#FF6961';
          cell.innerHTML += ` ${diff < 0 ? '&#9650;' : '&#9660;'}`;
        }
      } else {
        cell.style.backgroundColor = '#FF6961';
      }
      return;
    }

    if (key === 'rating') {
      const correctRating = parseInt(gameToGuess[key]);
      const guessedRating = parseInt(guessedGame[key]);
            
      if (guessedRating === correctRating) {
        cell.style.backgroundColor = '#77DD77';
      } else if (typeof guessedRating === "number" && typeof correctRating === "number") {
        const diff = guessedRating - correctRating;
        if (Math.abs(diff) <= 5) {
          cell.style.backgroundColor = '#FBB124';
          cell.innerHTML += ` ${diff < 0 ? '&#9650;' : '&#9660;'}`;
        } else {
          cell.style.backgroundColor = '#FF6961';
          cell.innerHTML += ` ${diff < 0 ? '&#9650;' : '&#9660;'}`;
        }
      } else {
        cell.style.backgroundColor = '#FF6961';
      }
      return;
    }
    
    if (key === 'genres') {
      const correctGenres = gameToGuess.genres.map(g => g.name);
      const guessedGenres = guessedGame.genres.map(g => g.name);

      const intersection = guessedGenres.filter(g => correctGenres.includes(g));
      
      if (intersection.length === guessedGenres.length && guessedGenres.length === correctGenres.length) {
          cell.style.backgroundColor = '#77DD77';
      } else if (intersection.length > 0) {
          cell.style.backgroundColor = '#FBB124';
      } else {
          cell.style.backgroundColor = '#FF6961';
      }
      return;
    }

    if (key === 'platforms') {
      const correctPlatforms = gameToGuess.platforms.map(g => g.name);
      const guessedPlatforms = guessedGame.platforms.map(g => g.name);

      const intersection = guessedPlatforms.filter(g => correctPlatforms.includes(g));
      
      if (intersection.length === guessedPlatforms.length && guessedPlatforms.length === correctPlatforms.length) {
          cell.style.backgroundColor = '#77DD77';
      } else if (intersection.length > 0) {
          cell.style.backgroundColor = '#FBB124';
      } else {
          cell.style.backgroundColor = '#FF6961';
      }
      return;
    }

  
  
    if (guessedGame[key] === gameToGuess[key]) {
      cell.style.backgroundColor = '#77DD77';
      // Add the category to the list of correct categories if it's not already there
      if (!correctCategories.includes(key)) {
        correctCategories.push(key);
      }
    } else {
      cell.style.backgroundColor = '#FF6961';
    }
  });

  if (guess === gameToGuess.name.toLowerCase()) {
    setTimeout(function() {
      alert("Congratulations! You've guessed the game!");
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
        alert("Game over! The game was  " + gameToGuess.name);
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
