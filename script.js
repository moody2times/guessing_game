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
let SHORT_TIME = 850;
let playerHiScore = 0;
let storeScore = "playerHiScore";

//Generate random numbers to use as secret number
const secret = () => {
	const randomNumbers = Math.random() * 20;
	secretNumber = Math.trunc(randomNumbers) + 1;
	return secretNumber;
};

//function to disable buttons
const disableButtons = () => {
	form.hintOne.setAttribute("disabled", true);
	form.hintTwo.setAttribute("disabled", true);
	form.playerNumber.setAttribute("disabled", true);
	form.check.setAttribute("disabled", true);
};

//function to enable buttons
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

//a function to help set info.textContent
const setTextContent = (element, string) => {
	element === info && (info.textContent = string);
	element === pressStart && (pressStart.textContent = string);
	element === points && (points.textContent = string);
	element === hiScore && (hiScore.textContent = string);
	element === display && (display.textContent = string);
	element === headerEmoji && (headerEmoji.textContent = string);
};

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
		setTextContent(points, `${healthPoints}`);
		setTextContent(display, `?`);
		setTextContent(info, `\xa0`);
		setTextContent(headerEmoji, `🤔`);
	}

	didPlayerWin
		? ((didPlayerWin = false), body.classList.remove("win"))
		: body.classList.remove("lose");
};

//timer function
const timer = (emoji, milSec) => {
	timerId = setTimeout(() => {
		setTextContent(info, `\xa0`);
		emoji && setTextContent(headerEmoji, `🤔`);
	}, milSec);
};

//what happens when player guesses
const onPlayerGuess = (right = false) => {
	right
		? ((headerEmoji.textContent = `😁`),
		  setTextContent(info, `Hooray!!! 🥳🎆 You guessed the number`),
		  body.classList.add("win"))
		: ((headerEmoji.textContent = `😭`),
		  setTextContent(info, `You lose!!!`),
		  body.classList.add("lose"));
	pressedStart = false;
	gameEnded = true;
	gameStarted = false;
	setTextContent(display, `${secretNumber}`);
	setTextContent(pressStart, `Play again?`);
	setGameState();
};

//a function to clear old timeOut and set new one
const renewTimeOut = (state = false, seconds) => {
	timerId && clearTimeout(timerId);
	timer(state, seconds);
};

//what happens when player press any use hint buttons
const onUseHint = (type) => {
	renewTimeOut(LONG_TIME);

	type === 1
		? (healthPoints--, setTextContent(points, `${healthPoints}`))
		: ((healthPoints -= 2), setTextContent(points, `${healthPoints}`));

	if (type === 1) {
		pressedHintOne = true;
		secretNumber % 2 === 0
			? setTextContent(info, `It is an even number 2️⃣`)
			: setTextContent(info, `It is an odd number 1️⃣`);
	} else {
		pressedHintTwo = true;
		secretNumber >= 10
			? setTextContent(info, `It is an double digits 🔟`)
			: setTextContent(info, `It is a single digit 0️⃣`);
	}
};

// function to prevent using a hint twice
const hintUsed = () => {
	renewTimeOut(SHORT_TIME);
	setTextContent(info, `Forbidden!!! 🚫`);
};

//function to warn against wrong input
const warning = (message = false) => {
	message
		? setTextContent(info, `Please enter a number to play`)
		: setTextContent(info, `Please enter a number from 1 - 20`);
	renewTimeOut(LONG_TIME);
};

const onSubmit = (event) => {
	event.preventDefault();

	//When user enter a number and press check
	if (event.submitter.id === "check") {
		//convert user number to a Number and reset the form
		const convertedPlayerNumber = parseInt(form.playerNumber.value);
		form.reset();
		form.playerNumber.focus();

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
			setTextContent(hiScore, playerHiScore);
			didPlayerWin = true;
			onPlayerGuess(true);
			localStorage.setItem(storeScore, playerHiScore.toString());
		} else {
			//what happens when player guessed wrong
			healthPoints--;
			setTextContent(points, `${healthPoints}`);
			if (healthPoints === 0) {
				//what happens when health points becomes zero
				onPlayerGuess();
				return;
			}
			setTextContent(
				info,
				secretNumber < convertedPlayerNumber
					? `Wrong, that is too high!`
					: `Wrong, that is too low!`
			);
			setTextContent(headerEmoji, `🤦‍`);
			renewTimeOut(true, SHORT_TIME);
			return;
		}
	}

	//BUG: When player use hint and points go below zero, the game does not end
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
		setTextContent(points, healthPoints);
		gameStarted = false;
		gameEnded = true;
		setGameState();
	}
};

//function to control enter keypress
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
