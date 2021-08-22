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
	didPlayerLose,
	gameStarted,
	gameEnded;
let playerHiScore = 0;
let storeScore = "playerHiScore";

//Generate random numbers to use as secret number
const secret = () => {
	const randomNumbers = Math.random() * 20;
	secretNumber = Math.trunc(randomNumbers) + 1;
	return secretNumber;
};

//On page load or refresh state
const setGameState = () => {
	if (gameStarted) {
		form.hintOne.removeAttribute("disabled");
		form.hintTwo.removeAttribute("disabled");
		form.playerNumber.removeAttribute("disabled");
		form.check.removeAttribute("disabled");
		form.playerNumber.focus();
		return;
	}

	if (gameEnded) {
		pressStart.removeAttribute("disabled");
		form.hintOne.setAttribute("disabled", true);
		form.hintTwo.setAttribute("disabled", true);
		form.playerNumber.setAttribute("disabled", true);
		form.check.setAttribute("disabled", true);
		return;
	}

	form.hintOne.setAttribute("disabled", true);
	form.hintTwo.setAttribute("disabled", true);
	form.playerNumber.setAttribute("disabled", true);
	form.check.setAttribute("disabled", true);
	if (playerHiScore === 0 && localStorage.key(storeScore)) {
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

	if (didPlayerWin) {
		didPlayerWin = false;
		body.classList.remove("win");
		gameBoard.classList.remove("gameBoard--win");
	}

	if (didPlayerLose) {
		didPlayerLose = false;
		body.classList.remove("lose");
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

// function to prevent using a hint twice
const hintUsed = () => {
	timer && clearTimeout(timer);
	timer(false, 500);
	info.textContent = `Forbidden!!! 🚫`;
};

const warning = (message = false) => {
	message
		? (info.textContent = `Please enter a number to play`)
		: (info.textContent = `Please enter a number from 1 - 20`);
	timer(false, 1700);
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
			gameBoard.classList.add("gameBoard--win");
			body.classList.add("win");
			info.textContent = `Hooray!!! 🥳🎆 You guessed the number`;
			headerEmoji.textContent = `😁`;
			display.textContent = `${secretNumber}`;
			playerHiScore += healthPoints;
			hiScore.textContent = playerHiScore;
			pressStart.textContent = `Continue?`;
			pressedStart = false;
			didPlayerWin = true;
			gameEnded = true;
			gameStarted = false;
			setGameState();
			localStorage.setItem(storeScore, playerHiScore.toString());
		} else {
			//what happens when player guessed wrong
			healthPoints--;
			points.textContent = `${healthPoints}`;
			if (healthPoints === 0) {
				//what happens when health points becomes zero
				display.textContent = `${secretNumber}`;
				body.classList.add("lose");
				info.textContent = `Game over!!! Continue?`;
				headerEmoji.textContent = `😭`;
				pressStart.textContent = `Play again?`;
				pressedStart = false;
				didPlayerLose = true;
				gameEnded = true;
				gameStarted = false;
				setGameState();
				return;
			}
			info.textContent = `Fail! Try again!!!`;
			headerEmoji.textContent = `🤦‍`;
			timer(true, 500);
			return;
		}
	}

	//what happens when player press use hint buttons
	if (event.submitter.id === "hintOne") {
		//what happens if player use hint one
		if (pressedHintOne) {
			//what happens if player already used hint one
			hintUsed();
			return;
		}
		pressedHintOne = true;
		healthPoints--;
		points.textContent = `${healthPoints}`;
		timer && clearTimeout(timer);
		timer(false, 1700);
		secretNumber % 2 === 0
			? (info.textContent = `It is an even number 2️⃣`)
			: (info.textContent = `It is an odd number 1️⃣`);
		return;
	}

	//what happens if player use hint two
	if (event.submitter.id === "hintTwo") {
		if (pressedHintTwo) {
			//what happens if player already used hint two
			hintUsed();
			return;
		}
		pressedHintTwo = true;
		healthPoints -= 2;
		points.textContent = `${healthPoints}`;
		timer && clearTimeout(timer);
		timer(false, 1700);
		secretNumber >= 10
			? (info.textContent = `It is double digits 🔟`)
			: (info.textContent = `It is single digit 0️⃣`);
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

/* TODO:
1. Change hiScore to score
2. Add a new feature - game is over after 5 games
3. Set the hiScore after the game is finally over
4. Store the hiScore in local storage to simulate database storage (completed)
*/
