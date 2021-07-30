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
const userNumber = document.getElementById("userNumber").value;
const check = document.getElementById("check");
const reset = document.getElementById("reset");

//Generate random numbers to use as secret number
const randomNumbers = Math.random() * 20;
const secretNumber = Math.trunc(randomNumbers) + 1;

//Code for receiving and using numbers entered by the users
const onCheck = () => {
	const convertedUserNumber = parseInt(userNumber);

	//Validation for user entry
	if (convertedUserNumber < 1 || convertedUserNumber > 20) {
		info.textContent = `Illegal number! Please enter a number from 1 - 20`;
	}
};

//Eventlisteners
check.addEventListener("click", onCheck);
