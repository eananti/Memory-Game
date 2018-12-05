/*PROJECT DIRECTION*/

/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


 /*
 * Global Variables
 */


const deck = document.querySelector('.deck');
const allPairs = 8;
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;


/*
*Toggling Randomly Placed Cards
*/


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//shuffle's deck using function above
function toShuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffledCards = shuffle(cardsToShuffle);
	for(let i = 0; i < shuffledCards.length; i++) {
		deck.appendChild(shuffledCards[i]);
	}
}
toShuffleDeck();

//Add event listener to card when clicked
deck.addEventListener('click', function(evt) {
	const clickTarget = evt.target;
	if(clickTarget.classList.contains('card') &&
	 !clickTarget.classList.contains('match') &&
		toggledCards.length < 2 &&
		!toggledCards.includes(clickTarget)) {
		if(clockOff) {
			startClock();
			clockOff = false;
		}
		toggleCard(clickTarget);
		addToToggledCards(clickTarget);
		if(toggledCards.length === 2) {
			// console.log('2 cards');
			checkForMatch(clickTarget);
			increaseMove();
			checkScore();
		}
	}
});

//turn card over
function toggleCard(card) {
	card.classList.toggle('open');
	card.classList.toggle('show');
};

//convert card value to an array
function addToToggledCards(clickTarget) {
	toggledCards.push(clickTarget);
};


//Check if card matches
function checkForMatch() {
	if(toggledCards[0].firstElementChild.className ===
		toggledCards[1].firstElementChild.className) {
		console.log('Matched!');
		toggledCards[0].classList.toggle('bounce');
		toggledCards[1].classList.toggle('bounce');

		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
		matched++;
		setTimeout(function() {
			win();
		}, 700)
	} else {
		setTimeout(function() {
			console.log('Not a match!');

			toggleCard(toggledCards[0]);
			toggleCard(toggledCards[1]);
			toggledCards = [];
		}, 500);
	}
}

//Check for win condition
function win() {
	// matched++
	if(matched === allPairs) {
		gameOver();
	}
}

//when game ends
function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
	resetCards();
}


/*
*Card Moves
*/

//increase moves for each turn of click
function increaseMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

//Check number of moves
function checkScore() {
	if(moves === 16 || moves === 24) {
		hideStar();
	}
}


/*
*Stars
*/

//Remove Star from the DOM
function hideStar() {
	const starList = document.querySelectorAll('.stars li');
	for(let i = 0; i < starList.length; i++) {
		if (starList[i].style.display !== 'none') {
			starList[i].style.display = 'none';
			break;
		}
	}
}

/*
*Time? Yeah!
*/


//start clock count
function startClock() {
	clockId = setInterval(function() {
		time++;
		displayTime();
	}, 1000);
}

//time display and format
function displayTime() {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	const clock = document.querySelector('.clock');
	clock.innerHTML = time;
	if(seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}

//clear time
function stopClock() {
	clearInterval(clockId);
}


/*
*Modal
*/


//Hide and Show Modal
function toggleModal() {
	const modal = document.querySelector('.modal-background');
	if(modal.classList.contains('hide')) {
		modal.classList.remove('hide');
	} else {
		modal.classList.add('hide');
	}
}

//modal stats info
function writeModalStats() {
	const timeStat = document.querySelector('.modal-time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal-moves');
	const starsStat = document.querySelector('.modal-stars');
	const stars = getStars();

	timeStat.innerHTML = `TIME : ${clockTime}`;
	movesStat.innerHTML = `MOVES : ${moves}`;
	starsStat.innerHTML = `STARS : ${stars}`;
}

//display star on modal
function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for(star of stars) {
		if(star.style.display !== 'none') {
			starCount++;
		}
	}
	// console.log(starCount);
	return starCount;
}

//click cancel button to close modal when clicked
document.querySelector('.modal-cancel').addEventListener('click', toggleModal);

//click replay button to replay game
document.querySelector('.modal-replay').addEventListener('click', replayGame);


/*
*Restart Game
*/


//click to restart game
document.querySelector('.restart').addEventListener('click', resetGame);

//replay game function
function replayGame() {
	// matched = 0
	resetGame();
	toggleModal();
	resetCards();
}

//resets all stats
function resetGame() {
	matched = 0;
	resetClock();
	resetMoves();
	resetStars();
	toShuffleDeck();
	resetCards();
}

//reset clock count
function resetClock() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

//reset card moves
function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

//reset star to three
function resetStars() {
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for(star of starList) {
		star.style.display = 'inline';
	}
}

//reset deck of cards
function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}
}