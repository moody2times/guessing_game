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

//Generate random numbers to use as secret number
const randomNumbers = Math.random() * 20;
const secretNumber = Math.trunc(randomNumbers) + 1;

//Code for receiving and using numbers entered by the users
const onCheck = () => {
	const convertedUserNumber = parseInt(playerNumber.value);

	//Validation for user entry
	if (convertedUserNumber < 1 || convertedUserNumber > 20) {
		form.reset();
		info.textContent = `Illegal number! Please enter a number from 1 - 20`;
		setTimeout(() => {
			info.textContent = "\xa0";
		}, 2000);
	}
};

//Eventlisteners
check.addEventListener("click", onCheck);
