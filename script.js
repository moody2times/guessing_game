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

//In-game variables
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

//Code for receiving and using numbers entered by the users
const onCheck = () => {
	const convertedPlayerNumber = parseInt(playerNumber.value);
	form.reset();

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
	console.log(event.target.id);
	//what happens if player use hint one
	if (event.target.id === "hintOne") {
		pressedHintOne = true;
		secretNumber % 2 === 0
			? (info.textContent = `It is an even number`)
			: (info.textContent = `It is an odd number`);
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 1500);
		return;
	}

	//what happens if player use hint two
	if (event.target.id === "hintTwo") {
		pressedHintTwo = true;
		secretNumber >= 10
			? (info.textContent = `It is double digits`)
			: (info.textContent = `It is single digit`);
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 1500);
		return;
	}
};

//Eventlisteners
check.addEventListener("click", onCheck);
hintOne.addEventListener("click", onUseHint);
hintTwo.addEventListener("click", onUseHint);
