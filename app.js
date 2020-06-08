/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

// Challenges
1. A player looses his ENTIRE score when he rolls two 6 in a row. After that, its the next player's
turn. (DONE!)
2. Add an input field to the HTML where players can set the winning score, so that they can change 
the predefined score of 100. 
3. Add another dice to the game, so that there are two dices now. The player looses his current 
score when one of them is a 1.


// ADVANCED FEATURES
- Add a timer for each turn. When it expires player will be penalized and be deducted of 20 points
- Add dice animation and damage / text that states the most recent event in the game
- Custom name support (settings functionality)
- Customize UI :)
- Show point difference
- Beautify with animation using anime.js
*/

var scores, roundScore, activePlayer, dice, isGamePlaying, prevDice;

newGame();

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (isGamePlaying) {
    setScores(`.prev-roll span`, prevDice);
    // Generate a random number
    var dice = Math.floor(Math.random() * 6) + 1;

    // Display the result
    var diceElement = document.querySelector(".dice");
    diceElement.style.display = "block";
    diceElement.src = `img/dice-${dice}.png`;

    // Update the round score if the number was not a 1.
    if (dice !== 1) {
      // check if player rolled a two consecutive 6s
      if (dice === 6 && dice === prevDice) {
        scores[activePlayer] = 0;
        setScores(`#score-${activePlayer}`, scores[activePlayer]);
        endTurn();
      }
      roundScore += dice;
      setScores(`#current-${activePlayer}`, roundScore);
      prevDice = dice;
    } else {
      endTurn();
    }
  }
});

document.querySelector(".btn-hold").addEventListener("click", function () {
  // Add current score to player's global score
  if (isGamePlaying) {
    scores[activePlayer] += roundScore;

    // Display the result
    setScores(`#score-${activePlayer}`, scores[activePlayer]);

    // Check if the score reached 100
    if (scores[activePlayer] >= 50) {
      alert(`Player ${activePlayer + 1} Wins!`);
      isGamePlaying = false;
    } else {
      endTurn();
    }
  }
});

document.querySelector(".btn-new").addEventListener("click", newGame);

function newGame() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  isGamePlaying = true;
  prevDice = 0;
  document.querySelector(".dice").style.display = "none";
  setScores(".player-score, .player-current-score", 0);

  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}

// document.querySelector.apply(".btn-settings");

function endTurn() {
  roundScore = 0;
  setScores(`#current-${activePlayer}`, roundScore);
  activePlayer = activePlayer === 0 ? 1 : 0;
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  prevDice = 0;
}

function setScores(selector, value) {
  var elements = document.querySelectorAll(selector);
  for (var i = 0; i < elements.length; i++) {
    elements[i].textContent = `${value}`;
  }
}

// Settings

function numerize(value) {
  return value.replace(/[^0-9]/g, "").replace(/(.*)/g, "$1");
}

document
  .querySelector(".custom-dropdown-wrapper")
  .addEventListener("click", function () {
    this.querySelector(".custom-options").classList.toggle("open");
  });

for (const option of document.querySelectorAll(".custom-option")) {
  option.addEventListener("click", function () {
    if (!this.classList.contains("selected")) {
      this.parentNode
        .querySelector(".custom-option.selected")
        .classList.remove("selected");
      this.classList.add("selected");
      this.closest(".custom-dropdown-wrapper").querySelector(
        ".custom-trigger span"
      ).textContent = this.textContent;
    }
  });
}
