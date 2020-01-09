let muteIcon = require("../img/mute(black).svg");
let volumeIcon = require("../img/volumeOn(black).svg");
let soundIcon;

//CHANGE SCREEN

function setClick(element, destination, callback) {
  document.querySelector(element).addEventListener("click", function() {
    oxo.screens.loadScreen(destination, callback);
  });
}

// AUDIO MUTE

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

oxo.screens.loadScreen("home", home);

function home() {
  setClick(".homePage__buttonPlay", "game", game);
  setClick(".homePage__buttonHowToPlay", "howToPlay", howToPlay);
  setClick(".buttonCredits", "credits", credits);
}

function game() {
  let audio = document.querySelector(".audio");
  soundIcon = document.querySelector(".soundControlIcon");
  audio.play();
  soundIcon.addEventListener("click", function() {
    mute();
  });
}

function end() {
  setClick(".endGame__buttonRestart", "game", game);
  setClick(".homePageIcon", "home", home);
}

function credits() {
  setClick(".homePageIcon", "home", home);
}

function howToPlay() {
  setClick(".homePageIcon", "home", home);
  setClick(".buttonCredits", "credits", credits);
}
