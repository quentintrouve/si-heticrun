//CHANGE SCREEN

function setClick(element, destination, callback) {
  document.querySelector(element).addEventListener("click", function() {
    oxo.screens.loadScreen(destination, callback);
  });
}

// AUDIO

let muteIcon = require("../img/muteBlack.svg");
let volumeIcon = require("../img/volumeOnBlack.svg");
let soundIcon;

function mute() {
  let audio = document.querySelector(".audio");
  if (audio.muted == false) {
    audio.muted = true;
    soundIcon.style.backgroundImage = "url('" + muteIcon + "')";
  } else {
    audio.muted = false;
    soundIcon.style.backgroundImage = "url('" + volumeIcon + "')";
  }
}

// SCREEN

oxo.screens.loadScreen("home", home);

function home() {
  setClick(".homePage__buttonPlay", "game", game);
  setClick(".homePage__buttonHowToPlay", "howToPlay", howToPlay);
  setClick(".buttonCredits", "credits", credits);
}

function game() {
  let character;
  let speedObj = 4;
  let speedJump = 1.2;
  let intervalObj = 3000;
  let intervalJump = speedJump * 1000;
  let intervalBend = speedJump * 1000;
  let characterPosition = 50;
  let invicible = false;
  let score = 0;
  let audio = document.querySelector(".audio");
  soundIcon = document.querySelector(".soundControlIcon");

  document.addEventListener("keydown", function(e) {
    if (e.keyCode === 40) {
      e.preventDefault();
    }
  });
  character = document.getElementById("character");
  //  Give the ability of moving to the character
  function jump(character) {
    oxo.inputs.listenKey("up", function() {
      if (!character.classList.contains("jump")) {
        character.classList.add("jump");
        setTimeout(() => {
          character.classList.remove("jump");
        }, intervalJump);
      }
    });
    oxo.inputs.listenKey("down", function() {
      if (!character.classList.contains("bend")) {
        character.classList.add("bend");
        setTimeout(() => {
          character.classList.remove("bend");
        }, intervalBend);
      }
    });
  }

  //    Create an obstacle like a chair, a table or a coffee dropped on the floor
  function createObstacle() {
    let i;
    let obs;
    i = oxo.utils.getRandomNumber(1, 4);

    if (i === 1) {
      obs = oxo.elements.createElement({
        class: "obstacles obstacles__table obstacles__move",
        obstacle: true,
        appendTo: ".try"
      });
      obs.setAttribute("id", "obstacle");
    } else if (i === 2) {
      obs = oxo.elements.createElement({
        class: "obstacles obstacles__chair obstacles__move",
        obstacle: true,
        appendTo: ".try"
      });
      obs.setAttribute("id", "obstacle");
    } else if (i === 3) {
      obs = oxo.elements.createElement({
        class: "obstacles obstacles__coffee obstacles__move",
        obstacle: true,
        appendTo: ".try"
      });
      obs.setAttribute("id", "obstacle");
    } else if (i === 4) {
      obs = oxo.elements.createElement({
        class: "obstacles obstacles__proj obstacles__move",
        obstacle: true,
        appendTo: ".try"
      });
      obs.setAttribute("id", "obstacle");
    }
    oxo.elements.onCollisionWithElement(character, obs, function() {
      // when the obstacle hits James, GAME OVER
      if (invicible === false) {
        oxo.screens.loadScreen("end", function() {
          clearIntervals();
          end();
        });
        obs.remove();
      }
    });
    oxo.elements.onLeaveScreenOnce(
      //when the obstacle leaves the screen, the div which contains the obstacle is removed
      obs,
      function() {
        obs.remove();
      },
      true
    );

    obs.style.animationDuration = speedObj + "s";
    character.style.animationDuration = speedJump + "s";
  }

  // creates an enemy
  function createEnnemy() {
    let e = oxo.elements.createElement({
      class: "ennemy ennemy__move",
      appendTo: ".try",
      obstacle: true
    });

    // increase difficulty
    oxo.elements.onCollisionWithElement(character, e, function() {
      if (speedObj > 1) speedObj -= 0.25; // console.log("object takes " + speedObj + "s to get out");
      if (intervalObj >= 500) intervalObj -= 500; // console.log("object takes " + intervalObj + "ms to come");
      if (speedJump >= 0.45) speedJump = speedJump - 0.05; // console.log("jump is set to " + speedJump);
      if (intervalBend >= 450) intervalBend = intervalBend - 50; // console.log("bend is set to " + intervalBend);
      characterPosition = 50;
      character.style.left = characterPosition + "px";
      oxo.player.addToScore(7500);
      score++;
      if (score == 10) {
        oxo.screens.loadScreen("victory", function() {
          clearIntervals();
          victory();
        });
      }
      e.remove();
    });
  }

  function createBonusWater() {
    let bonus;
    bonus = oxo.elements.createElement({
      class: "bonus bonus__move bonus--water",
      appendTo: ".try",
      obstacle: true
    });
    oxo.elements.onLeaveScreenOnce(
      bonus,
      function() {
        bonus.remove();
      },
      true
    );
    oxo.elements.onCollisionWithElement(character, bonus, function() {
      bonus.remove();
      if (characterPosition <= 350) {
        characterPosition += 100;
        character.style.left = characterPosition + "px";
      }
    });
  }
  function createBonusBirdies() {
    let bonus;
    bonus = oxo.elements.createElement({
      class: "bonus bonus__move bonus--birdies",
      appendTo: ".try",
      obstacle: true
    });
    oxo.elements.onLeaveScreenOnce(
      bonus,
      function() {
        bonus.remove();
      },
      true
    );
    oxo.elements.onCollisionWithElement(character, bonus, function() {
      bonus.remove();
      invicible = true;
      character.classList.add("invicible");
      setTimeout(function() {
        invicible = false;
        character.classList.remove("invicible");
      }, 5000);
    });
  }

  function setScore() {
    oxo.player.setScore(0);
  }

  function clearIntervals() {
    clearInterval(intervalObstacle);
    clearInterval(intervalEnnemy);
    clearInterval(intervalBonusWater);
    clearInterval(intervalBonusBirdies);
  }

  createEnnemy();
  jump(character);
  let intervalObstacle = setInterval(createObstacle, intervalObj);
  let intervalEnnemy = setInterval(createEnnemy, 30000);
  let intervalBonusWater = setInterval(createBonusWater, 7000);
  let intervalBonusBirdies = setInterval(createBonusBirdies, 20000);
  setScore();

  audio.play();
  soundIcon.addEventListener("click", function() {
    mute();
  });

  setClick(".homePageIcon--gamePage", "home", home);
  setClick(".try__restartIcon", "game", game);
}

function end() {
  setClick(".endGame__buttonRestart", "game", game);
  setClick(".homePageIcon", "home", home);
  document.getElementById("result").innerHTML =
    "Score : " +
    oxo.player.getScore() +
    "$ / 75 000$<br />Level : " +
    oxo.player.getScore() / 7500 +
    " / 10"; //récupère l'id du span, et ajoute le texte avec innerHtml
}

function credits() {
  setClick(".homePageIcon", "home", home);
}

function howToPlay() {
  setClick(".homePageIcon", "home", home);
  setClick(".buttonCredits", "credits", credits);
}

function victory() {
  setClick(".victory__buttonRestart", "game", game);
  setClick(".homePageIcon", "home", home);
}
