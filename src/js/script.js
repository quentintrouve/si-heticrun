function setClick(element, destination, callback) {
  document.querySelector(element).addEventListener("click", function() {
    oxo.screens.loadScreen(destination, callback);
  });
}

oxo.screens.loadScreen("home", home);

function home() {
  setClick(".homePage__buttonPlay", "game", game);
  setClick(".homePage__buttonHowToPlay", "howToPlay", howToPlay);
  setClick(".buttonCredits", "credits", credits);
}

function game() {}

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
