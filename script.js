"use strict";

//DOM elements to interact with
const body = document.body;
const headerEmoji = document.getElementById("headerEmoji");
const points = document.getElementById("points");
const hiScore = document.getElementById("hiScore");
const gameBoard = document.querySelector(".gameBoard");
const display = document.querySelector(".display");
const info = document.querySelector(".info");
const pressStart = document.getElementById("pressStart");
const form = document.getElementById("form");

//In-game state
let healthPoints,
	pressedStart,
	pressedHintOne,
	pressedHintTwo,
	secretNumber,
	didPlayerWin,
	gameStarted,
	gameEnded,
	timerId;

let LONG_TIME = 1700;
let SHORT_TIME = 500;
let playerHiScore = 0;
let storeScore = "playerHiScore";

//Generate random numbers to use as secret number
const secret = () => {
	const randomNumbers = Math.random() * 20;
	secretNumber = Math.trunc(randomNumbers) + 1;
	return secretNumber;
};

const disableButtons = () => {
	form.hintOne.setAttribute("disabled", true);
	form.hintTwo.setAttribute("disabled", true);
	form.playerNumber.setAttribute("disabled", true);
	form.check.setAttribute("disabled", true);
};

const enableButtons = () => {
	form.hintOne.removeAttribute("disabled");
	form.hintTwo.removeAttribute("disabled");
	form.playerNumber.removeAttribute("disabled");
	form.check.removeAttribute("disabled");
};

//On page load or refresh state
const setGameState = () => {
	if (gameStarted) {
		enableButtons();
		form.playerNumber.focus();
		return;
	}

	if (gameEnded) {
		pressStart.removeAttribute("disabled");
		disableButtons();
		return;
	}

	disableButtons();
	if (localStorage.key(storeScore)) {
		playerHiScore = +localStorage.getItem(storeScore);
		hiScore.textContent = playerHiScore;
	}
};
setGameState();

//What happens when start button is pressed
const onPressStart = () => {
	pressedStart = true;
	gameStarted = true;
	if (pressedStart) {
		setGameState();
		secret();
		pressStart.setAttribute("disabled", true);
		healthPoints = 7;
		pressedHintOne = false;
		pressedHintTwo = false;
		points.textContent = `${healthPoints}`;
		display.textContent = `?`;
		info.textContent = "\xa0";
		headerEmoji.textContent = `🤔`;
	}

	didPlayerWin
		? ((didPlayerWin = false), body.classList.remove("win"))
		: body.classList.remove("lose");
};

//timer function
const timer = (emoji = false, milSec) => {
	timerId = setTimeout(() => {
		info.textContent = "\xa0";
		emoji && (headerEmoji.textContent = `🤔`);
	}, milSec);
};

//what happens when player guesses
const onPlayerGuess = (right = false) => {
	right
		? ((headerEmoji.textContent = `😁`),
		  (info.textContent = `Hooray!!! 🥳🎆 You guessed the number`),
		  body.classList.add("win"))
		: ((headerEmoji.textContent = `😭`),
		  (info.textContent = `You lose!!!`),
		  body.classList.add("lose"));
	pressedStart = false;
	gameEnded = true;
	gameStarted = false;
	display.textContent = `${secretNumber}`;
	pressStart.textContent = `Play again?`;
	setGameState();
};

//a function to clear old timeOut and set new one
const renewTimeOut = (seconds) => {
	timerId && clearTimeout(timerId);
	timer(false, seconds);
};

//what happens when player press any use hint buttons
const onUseHint = (type) => {
	renewTimeOut(LONG_TIME);

	type === 1
		? (healthPoints--, (points.textContent = `${healthPoints}`))
		: ((healthPoints -= 2), (points.textContent = `${healthPoints}`));

	if (type === 1) {
		pressedHintOne = true;
		secretNumber % 2 === 0
			? (info.textContent = `It is an even number 2️⃣`)
			: (info.textContent = `It is an odd number 1️⃣`);
	} else {
		pressedHintTwo = true;
		secretNumber >= 10
			? (info.textContent = `It is double digits 🔟`)
			: (info.textContent = `It is single digit 0️⃣`);
	}
};

// function to prevent using a hint twice
const hintUsed = () => {
	renewTimeOut(SHORT_TIME);
	info.textContent = `Forbidden!!! 🚫`;
};

const warning = (message = false) => {
	message
		? (info.textContent = `Please enter a number to play`)
		: (info.textContent = `Please enter a number from 1 - 20`);
	renewTimeOut(LONG_TIME);
};

//REVIEW: Use helper functions to implement DRY
const onSubmit = (event) => {
	event.preventDefault();

	//When user enter a number and press check
	if (event.submitter.id === "check") {
		//convert user number to a Number and reset the form
		const convertedPlayerNumber = parseInt(form.playerNumber.value);
		form.reset();

		//What happens if player press check but entered no number
		if (!convertedPlayerNumber) {
			warning(true);
			return;
		}

		//Validation for user entry
		if (convertedPlayerNumber < 1 || convertedPlayerNumber > 20) {
			warning();
			return;
		}

		//what happens when player guessed right
		if (secretNumber === convertedPlayerNumber) {
			playerHiScore += healthPoints;
			hiScore.textContent = playerHiScore;
			didPlayerWin = true;
			onPlayerGuess(true);
			localStorage.setItem(storeScore, playerHiScore.toString());
		} else {
			//what happens when player guessed wrong
			healthPoints--;
			points.textContent = `${healthPoints}`;
			if (healthPoints === 0) {
				//what happens when health points becomes zero
				onPlayerGuess();
				return;
			}
			info.textContent = `Fail! Try again!!!`;
			headerEmoji.textContent = `🤦‍`;
			renewTimeOut(SHORT_TIME);
			return;
		}
	}

	//BUG: When player use hint and points go below zero, the game does not end
	//REVIEW: Refactor to keep DRY
	//what happens when player press use hint buttons
	if (event.submitter.id === "hintOne") {
		//what happens if player use hint one
		if (pressedHintOne) {
			//what happens if player already used hint one
			hintUsed();
			return;
		}
		onUseHint(1);
		return;
	}

	//what happens if player use hint two
	if (event.submitter.id === "hintTwo") {
		if (pressedHintTwo) {
			//what happens if player already used hint two
			hintUsed();
			return;
		}
		onUseHint(2);
		return;
	}

	//What happens when player press reset button
	if (event.submitter.id === "resetBtn") {
		healthPoints = 7;
		points.textContent = healthPoints;
		gameStarted = false;
		gameEnded = true;
		setGameState();
	}
};

const onKeyPressHandler = (event) => {
	const { key, keyCode } = event;
	if (key === "Enter" && keyCode === 13) {
		event.preventDefault();
	}
};

//Eventlisteners
pressStart.addEventListener("click", onPressStart);
form.addEventListener("submit", onSubmit);
form.addEventListener("keypress", onKeyPressHandler);
