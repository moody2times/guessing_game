"use strict";

//DOM elements to interact with
const headerEmoji = document.getElementById("headerEmoji");
const points = document.getElementById("points");
const hiScore = document.getElementById("hiScore");
const gameBoard = document.querySelector(".gameBoard");
const display = document.querySelector(".display");
const info = document.querySelector(".info");
const pressStart = document.getElementById("pressStart");
const form = document.getElementById("form");

//In-game state
let healthPoints, pressedStart, pressedHintOne, pressedHintTwo, secretNumber;
let playerHiScore = 0;

//Generate random numbers to use as secret number
const secret = () => {
	const randomNumbers = Math.random() * 20;
	secretNumber = Math.trunc(randomNumbers) + 1;
	return secretNumber;
};

//On page load or refresh state
const toggleButtonsState = (gameState = "preStart") => {
	if (gameState === "start") {
		pressedStart = true;
		form.hintOne.removeAttribute("disabled");
		form.hintTwo.removeAttribute("disabled");
		form.playerNumber.removeAttribute("disabled");
		form.check.removeAttribute("disabled");
		form.resetBtn.removeAttribute("disabled");
		return;
	}

	if (gameState === "continue") {
		secret();
		pressStart.removeAttribute("disabled");
		form.hintOne.setAttribute("disabled", true);
		form.hintTwo.setAttribute("disabled", true);
		form.playerNumber.setAttribute("disabled", true);
		form.check.setAttribute("disabled", true);
		gameBoard.classList.remove("gameBoard--win");
		gameBoard.classList.remove("gameBoard--lose");

		return;
	}

	form.hintOne.setAttribute("disabled", true);
	form.hintTwo.setAttribute("disabled", true);
	form.playerNumber.setAttribute("disabled", true);
	form.check.setAttribute("disabled", true);
	form.resetBtn.setAttribute("disabled", true);
};
toggleButtonsState();

//What happens when start button is pressed
const onPressStart = () => {
	toggleButtonsState("start");
	if (pressedStart) {
		secret();
		pressStart.setAttribute("disabled", true);
		healthPoints = 7;
		pressedHintOne = false;
		pressedHintTwo = false;
		points.textContent = `${healthPoints}`;
		display.textContent = `?`;
		info.textContent = "\xa0";
		headerEmoji.textContent = `🤔`;
		display.classList.remove("win");

		// if (display.classList.contains('win') ||
		// 	gameBoard.classList.contains('gameBoard--win') ||
		// 	gameBoard.classList.contains('gameBoard--lose')) {

		// 	}
	}
};

//timer function
const timer = (emoji = false, milSec) => {
	setTimeout(() => {
		info.textContent = "\xa0";
		emoji && (headerEmoji.textContent = `🤔`);
	}, milSec);
	return timer;
};

const onSubmit = (event) => {
	event.preventDefault();

	//When user enter a number and press check
	if (event.submitter.id === "check") {
		//convert user number to a Number and reset the form
		const convertedPlayerNumber = parseInt(form.playerNumber.value);
		form.reset();

		//What happens if player press check but entered no number or player's number is NaN
		if (!convertedPlayerNumber) {
			info.textContent = `Not a number!!! Please try again`;
			timer(false, 1700);
			return;
		}

		//Validation for user entry
		if (convertedPlayerNumber < 1 || convertedPlayerNumber > 20) {
			info.textContent = `Illegal number! Please enter a number from 1 - 20`;
			timer(false, 1700);
		} else {
			//what happens when player guessed right
			if (secretNumber === convertedPlayerNumber) {
				gameBoard.classList.add("gameBoard--win");
				display.classList.add("win");
				info.textContent = `Hooray!!! 🥳🎆 You guessed the number`;
				headerEmoji.textContent = `😁`;
				display.textContent = `${secretNumber}`;
				playerHiScore += healthPoints;
				hiScore.textContent = playerHiScore;
				pressStart.textContent = `Continue?`;
				pressedStart = false;
				toggleButtonsState("continue");
			} else {
				//what happens when player guessed wrong
				if (healthPoints) {
					info.textContent = `Fail! Try again!!!`;
					headerEmoji.textContent = `🤦‍`;
					healthPoints--;
					points.textContent = `${healthPoints}`;
					if (healthPoints === 0) {
						//what happens when health points becomes zero
						clearTimeout(timer);
						gameBoard.classList.add("gameBoard--lose");
						info.textContent = `Game over!!! Continue?`;
						headerEmoji.textContent = `😭`;
						pressStart.textContent = `Play again?`;
						toggleButtonsState("continue");
						pressedStart = false;
						return;
					}
					timer(true, 500);
				}
			}
		}
	}

	//REFACTOR:
	//what happens when player press use hint buttons
	if (event.submitter.id === "hintOne") {
		//what happens if player use hint one
		if (pressedHintOne) {
			//what happens if player already used hint one
			info.textContent = `Forbidden!!! 🚫`;
			timer(false, 500);
			return;
		}
		pressedHintOne = true;
		healthPoints--;
		points.textContent = `${healthPoints}`;
		secretNumber % 2 === 0
			? (info.textContent = `It is an even number 2️⃣`)
			: (info.textContent = `It is an odd number 1️⃣`);
		timer(false, 1700);

		return;
	}

	//what happens if player use hint two
	if (event.submitter.id === "hintTwo") {
		if (pressedHintTwo) {
			//what happens if player already used hint two
			info.textContent = `Forbidden!!! 🚫`;
			timer(false, 500);

			return;
		}
		pressedHintTwo = true;
		healthPoints -= 2;
		points.textContent = `${healthPoints}`;
		secretNumber >= 10
			? (info.textContent = `It is double digits 🔟`)
			: (info.textContent = `It is single digit 0️⃣`);
		timer(false, 1700);

		return;
	}

	//What happens when player press reset button
	if (event.submitter.id === "resetBtn") {
		hiScore.textContent = 0;
		onPressStart();
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
