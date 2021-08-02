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
let healthPoints = 5;
let pressedStart = false;
let pressedHintOne = false;
let pressedHintTwo = false;
let isGameOver = false;
let didPlayerWin = false;
let playerHiScore = 0;

//Generate random numbers to use as secret number
const randomNumbers = Math.random() * 20;
const secretNumber = Math.trunc(randomNumbers) + 1;
console.log(secretNumber);

//When user enter a number and press check
const onCheck = () => {
	//What happens after player wins
	if (didPlayerWin) {
		return;
	}

	//convert user number to a Number and reset the form
	const convertedPlayerNumber = parseInt(playerNumber.value);
	form.reset();

	//What happens if player press check but entered no number or player's number is NaN
	console.log(convertedPlayerNumber);
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
		} else {
			//what happens when player guessed wrong
			if (healthPoints >= 1) {
				info.textContent = `Fail! Try again!!!`;
				healthPoints--;
				points.textContent = `${healthPoints}`;
				setTimeout(() => {
					info.textContent = "\xa0";
				}, 500);
			} else {
				//what happens when health points becomes zero
				isGameOver = true;
			}
		}
	}
};

//What happens when player use hints
const onUseHint = (event) => {
	//What happens after player wins
	if (didPlayerWin) {
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
};

//Eventlisteners
check.addEventListener("click", onCheck);
hintOne.addEventListener("click", onUseHint);
hintTwo.addEventListener("click", onUseHint);
reset.addEventListener("click", onResetGame);
