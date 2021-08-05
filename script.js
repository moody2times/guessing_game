"use strict";

//DOM elements to interact with
const headerEmoji = document.getElementById("headerEmoji");
const points = document.getElementById("points");
const hiScore = document.getElementById("hiScore");
const display = document.querySelector(".display");
const info = document.querySelector(".info");
const pressStart = document.getElementById("pressStart");
const hintOne = document.getElementById("hintOne");
const hintTwo = document.getElementById("hintTwo");
const form = document.getElementById("form");
const playerNumber = document.getElementById("playerNumber");
const check = document.getElementById("check");
const reset = document.getElementById("reset");

//In-game state
let healthPoints,
	pressedStart,
	pressedHintOne,
	pressedHintTwo,
	isGameOver,
	didPlayerWin,
	secretNumber;
let playerHiScore = 0;

//On page load or refresh state
hintOne.setAttribute("disabled", true);
hintTwo.setAttribute("disabled", true);
playerNumber.setAttribute("disabled", true);
check.setAttribute("disabled", true);
reset.setAttribute("disabled", true);

//Generate random numbers to use as secret number
const secret = () => {
	const randomNumbers = Math.random() * 20;
	secretNumber = Math.trunc(randomNumbers) + 1;
	return secretNumber;
};
secret();

//What happens when start button is pressed
const onPressStart = () => {
	pressedStart = true;
	if (pressedStart) {
		hintOne.removeAttribute("disabled");
		hintTwo.removeAttribute("disabled");
		check.removeAttribute("disabled");
		reset.removeAttribute("disabled");
		playerNumber.removeAttribute("disabled");
		pressStart.setAttribute("disabled", true);
		healthPoints = 5;
		pressedHintOne = false;
		pressedHintTwo = false;
		isGameOver = false;
		didPlayerWin = false;
		points.textContent = `${healthPoints}`;
		display.textContent = `❓`;
		info.textContent = "\xa0";
	}
};

//When user enter a number and press check
const onCheck = () => {
	//What happens after player wins
	if (didPlayerWin || isGameOver) {
		return;
	}

	//convert user number to a Number and reset the form
	const convertedPlayerNumber = parseInt(playerNumber.value);
	form.reset();

	//What happens if player press check but entered no number or player's number is NaN
	if (!convertedPlayerNumber) {
		info.textContent = `Not a number!!! Please try again`;
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 2000);
		return;
	}

	//Validation for user entry
	if (convertedPlayerNumber < 1 || convertedPlayerNumber > 20) {
		info.textContent = `Illegal number! Please enter a number from 1 - 20`;
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 2000);
	} else {
		//what happens when player guessed right
		if (secretNumber === convertedPlayerNumber) {
			info.textContent = `Hooray!!! 🥳🎆 You guessed the number`;
			didPlayerWin = true;
			display.textContent = `${secretNumber}`;
			playerHiScore += healthPoints;
			hiScore.textContent = `${playerHiScore}`;
			pressStart.textContent = `Continue?`;
			pressedStart = false;
			secret();
			pressStart.removeAttribute("disabled");
			hintOne.setAttribute("disabled", true);
			hintTwo.setAttribute("disabled", true);
			playerNumber.setAttribute("disabled", true);
			check.setAttribute("disabled", true);
		} else {
			//what happens when player guessed wrong
			if (healthPoints) {
				info.textContent = `Fail! Try again!!!`;
				healthPoints--;
				points.textContent = `${healthPoints}`;
				setTimeout(() => {
					info.textContent = "\xa0";
				}, 500);
				if (healthPoints === 0) {
					//what happens when health points becomes zero
					isGameOver = true;
					pressedStart = false;
					info.textContent = `Game over!!! Continue?`;
					hiScore.textContent = `${healthPoints}`;
					pressStart.textContent = `Play again?`;
					pressStart.removeAttribute("disabled");
					hintOne.setAttribute("disabled", true);
					hintTwo.setAttribute("disabled", true);
					playerNumber.setAttribute("disabled", true);
					check.setAttribute("disabled", true);
					//clear the timeout
				}
			}
		}
	}
};

//What happens when player use hints
const onUseHint = (event) => {
	//What happens after player wins
	if (didPlayerWin || isGameOver) {
		return;
	}

	//what happens if player use hint one
	if (event.target.id === "hintOne") {
		if (pressedHintOne) {
			//what happens if player already used hint one
			info.textContent = `Forbidden!!! 🚫`;
			setTimeout(() => {
				info.textContent = "\xa0";
			}, 800);
			return;
		}
		pressedHintOne = true;
		healthPoints--;
		points.textContent = `${healthPoints}`;
		secretNumber % 2 === 0
			? (info.textContent = `It is an even number 2️⃣`)
			: (info.textContent = `It is an odd number 1️⃣`);
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 1500);
		return;
	}

	//what happens if player use hint two
	if (event.target.id === "hintTwo") {
		if (pressedHintTwo) {
			//what happens if player already used hint two
			info.textContent = `Forbidden!!! 🚫`;
			setTimeout(() => {
				info.textContent = "\xa0";
			}, 800);
			return;
		}
		pressedHintTwo = true;
		healthPoints--;
		points.textContent = `${healthPoints}`;
		secretNumber >= 10
			? (info.textContent = `It is double digits 🔟`)
			: (info.textContent = `It is single digit 0️⃣`);
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 1500);
		return;
	}
};

//What happens when player press reset button
const onResetGame = () => {
	healthPoints = 5;
	playerHiScore = 0;
	pressedStart = false;
	pressedHintOne = false;
	pressedHintTwo = false;
	isGameOver = false;
	didPlayerWin = false;
	points.textContent = `${healthPoints}`;
	hiScore.textContent = `${playerHiScore}`;
	display.textContent = `❓`;
	info.textContent = "\xa0";
	secret();
	playerNumber.removeAttribute("disabled");
};

//Eventlisteners
pressStart.addEventListener("click", onPressStart);
check.addEventListener("click", onCheck);
hintOne.addEventListener("click", onUseHint);
hintTwo.addEventListener("click", onUseHint);
reset.addEventListener("click", onResetGame);
