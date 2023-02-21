const circlesContainer = document.querySelector('.circles'); // Const for the circlesContainer <div></div>.
let CHEAT_MODE = false;
let circleElements = [];
const choiceOfColors = [
  'red',
  'blue',
  'green',
  'yellow',
  'orange',
  'purple',
  'pink',
  'brown',
]; // Const for the circle in the circle.
let pickColorsList = [...choiceOfColors, ...choiceOfColors]; // Const to create duplicate colors list using spread operator.
let circleCount = pickColorsList.length; // Const for how many circles in the game.

// Game Codition at the beginning.
let knownCount = 0; // Imagine game has begin, no circle has been known.
let activeCircle = null; // The user has click one of the circle and now waiting to click on the next circle.
let waitingMove = false; // Waiting for to close back the circle when the guess is wrong.
let interval = null;
let timeSeconds = 0;

function updateCircleCheat() {
  circleElements = document.getElementsByClassName('circle');
  for (let cEl of circleElements) {
    if (CHEAT_MODE) {
      console.log(`5px solid ${cEl.getAttribute('circle-color')} !important`);
      cEl.style.border = `5px solid ${cEl.getAttribute('circle-color')}`;
    } else {
      cEl.style.border = null;
    }
  }
}

function toggleCheatMode() {
  CHEAT_MODE = !CHEAT_MODE;
  updateCircleCheat();
}

function startGame() {
  circlesContainer.innerHTML = '';
  pickColorsList = [...choiceOfColors, ...choiceOfColors]; // Const to create duplicate colors list using spread operator.
  circleCount = pickColorsList.length; // Const for how many circles in the game.

  // Game Codition at the beginning.
  knownCount = 0; // Imagine game has begin, no circle has been known.
  activeCircle = null; // The user has click one of the circle and now waiting to click on the next circle.
  waitingMove = false; // Waiting for to close back the circle when the guess is wrong.
  timeSeconds = 0;
  let timeEl = document.getElementById('displayText');
  timeEl.innerHTML = '0';
  if (interval != null) {
    clearInterval(interval);
    interval = null;
  }
  // Create the 16 circles (using For Loop).
  for (let i = 0; i < circleCount; i++) {
    const randomIndex = Math.floor(Math.random() * pickColorsList.length); // To pick random colors in the pickColorsList
    const colorInCircle = pickColorsList[randomIndex];
    const circle = buildCircle(colorInCircle);

    pickColorsList.splice(randomIndex, 1); // Once a color is chosen, remove it from the pickColorsList. '1' mean remove a single color from the pickColorList.
    circlesContainer.appendChild(circle); // Add circle to the circlesContainer.
    //activeCircle.innerHTML =+ `<div class="circle" circle-color="red" circle-revealed="false" onclick="triggerCircle(event)"></div>`
  }
  updateCircleCheat();
  interval = setInterval(() => {
    timeSeconds += 1;
    let timeEl = document.getElementById('displayText');
    timeEl.innerHTML = timeSeconds;
  }, 1000);
}

// Function for building circle.
function buildCircle(colorInCircle) {
  const el = document.createElement('div'); // Create new div element.

  el.classList.add('circle');
  el.setAttribute('circle-color', colorInCircle); // Set attribute to circle.
  el.setAttribute('circle-revealed', 'false'); // Set attribute to circle.

  el.addEventListener('click', () => {
    const revealed = el.getAttribute('circle-revealed'); // Get the attribute of the circle.

    // revealed means 2 color matched and they are left in an open state.
    // waiting move is for animation/color change purpose, short 1 second pause before we can continue the game
    if (waitingMove || revealed === 'true' || el === activeCircle) {
      return; // Exit the function once 2 clicks has occured.
    }
    el.style.backgroundColor = colorInCircle;

    if (!activeCircle) {
      activeCircle = el; // This line is for the 1st circle that is reveal and awaits the next reveal circle to see if there is match.

      return; //
    }
    // Matching condition
    const matchingColor = activeCircle.getAttribute('circle-color'); // Get the attribute of the circle

    // second element matches activeCircle(1st clicked unrevealed circle)
    if (matchingColor === colorInCircle) {
      // If there is a match.
      activeCircle.setAttribute('circle-revealed', 'true');
      el.setAttribute('circle-revealed', 'true'); // Update the data that the there is a match.
      waitingMove = false;
      activeCircle = null;
      knownCount += 2; // knownCount 2 because a pair is match.

      if (knownCount === circleCount) {
        // All circles is revealed and match accordingly.
        clearInterval(interval);
        interval = null;
        alert(`Complete Game in ${timeSeconds}s!`);
      }

      return;
    }

    // If there is no match.
    waitingMove = true;

    // 1 second paused
    setTimeout(() => {
      el.style.backgroundColor = null; // This refer to the 1st circle open.
      activeCircle.style.backgroundColor = null; // This refer to the 2nd circle open.

      waitingMove = false;
      activeCircle = null;
    }, 1000); // This line is when both circles are incorrect and need to be hide back again in 1 sec.
  });

  return el;
}

// Make 6 by 6 circles..
