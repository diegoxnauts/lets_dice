/*
GAME RULES:

Difficulty Easy:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach winning points on GLOBAL score wins the game

Difficulty Hard:
- (1 dice) If the player rolls the same score back to back he looses his ENTIRE SCORE. Afterwhich, its the next player's trun.
- (2 dice) If the player rolls a double he looses his ENTIRE SCORE. Afterwhich, its the next player's turn


// FUTURE PLANNED FEATURES
- Add a timer for each turn. When it expires player will be penalized and be deducted of 20 points
- Add dice animation and damage / text that states the most recent event in the game
- Maybe add a 
*/

let scores, roundScore, activePlayer, isGamePlaying, prevDice;

let settings = {
  playerName1: "Player 1",
  playerName2: "Player 2",
  winningScore: 100,
  noOfDice: 1,
  difficulty: "Normal",
};

newGame();

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (isGamePlaying) {
    // Generate a random number for respective dice
    let diceScores = [...Array(settings.noOfDice)].map((x) => 0);
    for (let i = 0; i < diceScores.length; i++) {
      diceScores[i] = Math.floor(Math.random() * 6) + 1;
    }

    // Display the result
    let dices = document.querySelectorAll(".dice:not(.hidden)");

    for (let i = 0; i < diceScores.length; i++) {
      dices[i].src = `img/dice-${diceScores[i]}.png`;
    }

    // Update the round score if all dices didn't roll any 1s.
    if (!diceScores.includes(1)) {
      // check if player rolled same score 2 in a row (1 dice) OR dice scores are not the same (2 or more dice) (hard mode)
      if (
        ((diceScores[0] === prevDice && diceScores.length === 1) ||
          (ifAllSameRoll(diceScores) && diceScores.length > 1)) &&
        settings.difficulty === "hard"
      ) {
        scores[activePlayer] = 0;
        setScores(`#score-${activePlayer}`, scores[activePlayer]);
        endTurn();
      }

      roundScore += diceScores.reduce(
        (accumulator, currentVal) => accumulator + currentVal,
        0
      );
      setScores(`#current-${activePlayer}`, roundScore);
      prevDice = diceScores.reduce(
        (accumulator, currentVal) => accumulator + currentVal,
        0
      );
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
    if (scores[activePlayer] >= settings.winningScore) {
      document
        .querySelector(`.player-${activePlayer}-panel`)
        .classList.add("winner");
      isGamePlaying = false;
    } else {
      endTurn();
    }
  }
});

document.querySelector(".btn-new").addEventListener("click", newGame);

document.querySelector(".btn-settings").addEventListener("click", function () {
  document.querySelector(".settings").classList.toggle("hide");
  document.querySelector(".main-game").classList.toggle("hide");
});

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

document.querySelector(".btn-save").addEventListener("click", saveSettings);

function newGame() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  isGamePlaying = true;
  prevDice = 0;

  // displaying how many dices should be shown
  const dices = document.querySelectorAll(".dice");
  let activeDices = dices.length;

  for (const dice of dices) {
    dice.classList.remove("hidden");
  }

  for (const dice of dices) {
    if (activeDices !== settings.noOfDice) {
      dice.classList.add("hidden");
      activeDices -= 1;
    }
  }

  setScores(".player-score, .player-current-score", 0);

  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.add("active");

  document.querySelector("#name-0").textContent = settings.playerName1;
  document.querySelector("#name-1").textContent = settings.playerName2;
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
  let elements = document.querySelectorAll(selector);
  for (let i = 0; i < elements.length; i++) {
    elements[i].textContent = `${value}`;
  }
}

function ifAllSameRoll(diceScores) {
  for (let i = 0; i < diceScores.length; i++) {
    if (diceScores[0] !== diceScores[i]) {
      return false;
    }
  }
  return true;
}

function numerize(value) {
  return value.replace(/[^0-9]/g, "").replace(/(.*)/g, "$1");
}

function saveSettings() {
  settings.playerName1 = document.querySelector("#player-1").value;
  settings.playerName2 = document.querySelector("#player-2").value;
  settings.winningScore = parseInt(
    document.querySelector("#winning-score").value
  );
  settings.noOfDice = parseInt(
    document.querySelector(".custom-dropdown-wrapper .dice-number").textContent
  );
  settings.difficulty = document.querySelector(
    ".custom-radio input[type='radio']:checked"
  ).value;

  document.querySelector(".settings").classList.toggle("hide");
  document.querySelector(".main-game").classList.toggle("hide");

  // restart the game
  newGame();

  console.log("Settings Saved");
}
