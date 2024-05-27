let newWindow;
let resizeStartTime;
let lastWidth, lastHeight;
let currentLevel = 1;
let levelStartTime;
let currentTime;
let timeRemaining;
let currentlyResizing = false; // Variable to track if resizing is happening
let resizeTimeout; // Variable to store the timeout ID
let pleasureGauge = 0;
let automaticPleasureDecrease;
let transitionBuffer = 5000;
let hint = "";
let pleasureTarget = {
  level1: 10000,
  level2: 30000,
  level3: 60000,
  level4: 90000,
  level5: 100000,
};

let winheight = 100;
let winsize = 100;
let x = 5;

const level1 = "level1";
const level2 = "level2";
const level3 = "level3";
const level4 = "level4";
const level5 = "level5";

const playerWon = "playerwon";

let state = level1;
let pleasurePenalty;
let pleasureIncrement;
let maxSpeed;
let minSpeed;

const levelDuration = 15000; // 15 seconds
const penaltyDuration = 1000; // 1 second

function preload() {}

function setup() {
  p5Canvas();
  openPopup();
  startGame();
  sensitivity(100, 50, 0.09, 0.006, 10);
}

function draw() {
  displayBackground();
  push();
  pop();
  push();
  textSize(32);
  text(hint, windowWidth - 300, windowHeight - 100);
  text(state, windowWidth - 100, windowHeight - 50);
  pop();

  if (state === level1 && pleasureGauge >= pleasureTarget.level1) {
    state = level2;
    initializeLevel(2);
  } else if (state === level2 && pleasureGauge >= pleasureTarget.level2) {
    state = level3;
    initializeLevel(3);
  } else if (state === level3 && pleasureGauge >= pleasureTarget.level3) {
    state = level4;
    initializeLevel(4);
  } else if (state === level4 && pleasureGauge >= pleasureTarget.level4) {
    state = level5;
    initializeLevel(5);
  } else if (state === level5 && pleasureGauge >= pleasureTarget.level5) {
    state = playerWon;
    console.log("Player won!");
    newWindow.close();
  }

  if (state !== playerWon) {
    pleasureGauge = constrain(pleasureGauge, 0, pleasureTarget.level5);
    pleasureGauge -= automaticPleasureDecrease;
  }

  displayGauge();
}

function openPopup() {
  newWindow = window.open("../../resizeMe.html", "_blank", "scrollbars");
  newWindow.moveTo(0, 0);
  newWindow.resizeTo(100, 100);
}

function startGame() {
  resizeStartTime = new Date().getTime();
  lastWidth = newWindow.innerWidth;
  lastHeight = newWindow.innerHeight;
  levelStartTime = new Date().getTime();
  timeRemaining = levelDuration;
  newWindow.addEventListener("resize", handleResize);
}

function handleResize() {
  currentlyResizing = true;
  currentTime = new Date().getTime();
  const elapsed = currentTime - resizeStartTime;
  const newWidth = newWindow.innerWidth;
  const newHeight = newWindow.innerHeight;
  const widthChange = Math.abs(newWidth - lastWidth);
  const heightChange = Math.abs(newHeight - lastHeight);
  const sizeChange = widthChange + heightChange;
  const speed = sizeChange / elapsed; // Change per millisecond

  resizeStartTime = currentTime;
  lastWidth = newWidth;
  lastHeight = newHeight;

  checkSpeed(speed);

  updateTimeRemaining();

  checkResizeStability(200);
}

function displayGauge() {
  let mappedGauge = map(pleasureGauge, 0, pleasureTarget.level5, 0, 1000);
  push();
  rect(200, 200, mappedGauge, 30);
  pop();
}

function checkSpeed(speed) {
  if (speed > maxSpeed) {
    hint = "slower";
    applyPenalty();
  } else if (speed < minSpeed) {
    hint = "faster";
    applyPenalty();
  } else {
    hint = "This feels good";
    trackProgress();
  }
}

function updateTimeRemaining() {
  pleasureGauge += pleasureIncrement;
}

function applyPenalty() {
  pleasureGauge -= pleasurePenalty;
  if (pleasureGauge < 0) {
    downgradeLevel();
  }
}

function trackProgress() {
  if (pleasureGauge >= pleasureTarget[`level${currentLevel}`]) {
    upgradeLevel();
  }
}

function upgradeLevel() {
  if (currentLevel < 5) {
    initializeLevel(currentLevel + 1);
    // pleasureGauge = 0; // Reset the pleasure gauge for the new level
    console.log(`Upgraded to level ${currentLevel}`);
  } else {
    state = playerWon;
    console.log("Player won!");
    newWindow.close();
  }
}

function downgradeLevel() {
  if (currentLevel > 1) {
    initializeLevel(currentLevel - 1);
    //  pleasureGauge = 0; // Reset the pleasure gauge for the downgraded level
    console.log(`Downgraded to level ${currentLevel}`);
  }
}

function initializeLevel(level) {
  currentLevel = level;
  switch (level) {
    case 1:
      sensitivity(100, 50, 0.09, 0.006, 10);
      state = level1;
      break;
    case 2:
      sensitivity(150, 50, 0.2, 0.01, 10);
      state = level2;
      break;
    case 3:
      sensitivity(200, 50, 0.5, 0.02, 10);
      state = level3;
      break;
    case 4:
      sensitivity(250, 50, 5, 0.17, 10);
      state = level4;
      break;
    case 5:
      sensitivity(300, 50, 39, 1, 10);
      state = level5;
      break;
  }
}

function sensitivity(penalty, increment, max, min, autoDecrease) {
  pleasurePenalty = 0;
  pleasureIncrement = 0;
  automaticPleasureDecrease = 0;
  setTimeout(() => {
    pleasurePenalty = penalty;
    pleasureIncrement = increment;
    automaticPleasureDecrease = autoDecrease;
  }, transitionBuffer);
  maxSpeed = max;
  minSpeed = min;
}

function checkResizeStability(buffer) {
  let initialWidth = window.innerWidth;
  let initialHeight = window.innerHeight;
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  currentlyResizing = true;

  resizeTimeout = setTimeout(() => {
    let currentWidth = window.innerWidth;
    let currentHeight = window.innerHeight;

    if (initialWidth === currentWidth && initialHeight === currentHeight) {
      currentlyResizing = false;
      hint = "faster";
    }
  }, buffer);
}

function displayBackground() {
  push();
  fillHsluv(11, 96, 53);
  noStroke();
  rect(0, 0, windowWidth, windowHeight);
  pop();
}

function go2() {
  if (winheight >= screen.availHeight - 1) {
    x = 0;
  }
  newWindow.resizeBy(1, x);
  winheight -= 1;
  winsize -= 1;
  if (winsize >= screen.width - 1) {
    winheight = 100;
    winsize = 100;
    x = 1;
    return;
  }
  setTimeout(go2, 50);
}

function fillHsluv(h, s, l) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l) {
  const rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function p5Canvas() {
  createCanvas(windowWidth, windowHeight);
  window.addEventListener("resize", () => {
    resizeCanvas(windowWidth, windowHeight);
  });
}
