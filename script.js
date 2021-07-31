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
		} else {
			//what happens when player guessed wrong
			info.textContent = `Fail! Try again!!!`;
			healthPoints--;
			points.textContent = `${healthPoints}`;
			setTimeout(() => {
				info.textContent = "\xa0";
			}, 500);
		}
	}
};

//Eventlisteners
check.addEventListener("click", onCheck);
