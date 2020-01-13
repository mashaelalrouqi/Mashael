
let cardsArray = ['fa-spinner', 'fa-spinner', 'fa-star-o', 'fa-sun-o', 'fa-tint', 'fa-umbrella', 'fa-umbrella', 'fa-star-half-o', 'fa-tree', 'fa-fire', 'fa-tree', 'fa-fire', 'fa-sun-o', 'fa-star-o', 'fa-star-half-o', 'fa-tint'];

let lock = false;
let firstClick = null, secondClick = null;
let li1 = null, li2 = null; 
let moves = 0;
let lastMoves = document.querySelector('#fin-moves');
let lastTime = document.querySelector('#fin-time');
let counter = document.querySelector('.moves');
let machedCard = 0;

// star icon variable
const allStars = document.querySelectorAll('.fa-star');
console.log(allStars, "STAR");

// Time variables
let time = document.querySelector('.displayTime');
let startGame = 0;
let gameInterval;

let modal = document.querySelector('.pop-up')

const buttonRestart = document.getElementsByClassName('restart');


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function timer() {
    let minutes = 0;
    let seconds = 0;
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        time.innerHTML = minutes + ":" + seconds;
        lastTime.textContent = time.textContent;
    }, 1000);
}

function endOfGame() {
    clearInterval(gameInterval);
}


function displaySymbol(el) {
    el.classList.add("open");
    el.classList.add("show");
}


function closeUnmatchedCards() {
    let els = document.getElementsByClassName('unMatch');
    Array.from(els).forEach(el => {
        el.classList.remove('unMatch');
        el.classList.remove('show');
        el.classList.remove('open');
    });
}


function restartClick() {
    firstClick = null;
    secondClick = null;
}

function changeRating() {
    if (moves === 10) {
        return true;
    } else if (moves === 16) {
        allStars[0].classList.add('hide')
        allStars[3].classList.add('hide');
    } else if (moves === 20) {
        allStars[1].classList.add('hide');
        allStars[4].classList.add('hide');
    }
}


function moveCounter() {
    moves++;
    counter.innerHTML = moves;
    lastMoves.innerHTML = moves;
    if (moves <= 20 && moves !== 0) {
        changeRating()
    }
}


function restarValue() {
    for (let i = 0; i < 3; i++) {
        allStars[i].classList.remove('hide');
    }
    for (let i = 0; i < 3; i++) {
        allStars[i].classList.remove('hide');
    }

    // empty matched cards variables
    machedCard = 0;
    startGame = 0;
    moves = 0;
    counter.textContent = 0;
    li1 = null;
    li2 = null;
    modal.classList.remove('showed');
    modal.classList.add('hide');
}


// newCard function
const newCard = cardClass => {
    let li = document.createElement("li");
    li.classList.add("card");
    let icon = document.createElement("i");
    li.appendChild(icon);
    icon.classList.add("fa");
    icon.classList.add(cardClass);
    return li;
};


const pickACard = card => {

    card.addEventListener('click', function (e) {
        // we start the time at the first click
        if (startGame === 0) {
            timer();
            startGame++;
        }

        let li = e.currentTarget;
        if (lock || li.classList.contains('open') && li.classList.contains('show')) {
            return true;
        }

        let icon = li.getElementsByClassName('fa')[0].className;

        if (firstClick === null && secondClick === null) {

            firstClick = icon;
            li1 = li; 
        } else if (firstClick !== null && secondClick === null) {
            secondClick = icon;
            li2 = li; 
            if (firstClick === secondClick) {
                li1.classList.add('match');
                li1.classList.add('true');
                li2.classList.add('match');
                li2.classList.add('true');
                machedCard++;
                if (machedCard === 8) {
                    endOfGame()
                    modal.classList.remove('hide')
                    modal.classList.add('showed')
                }
            } else {
                li1.classList.add('unMatch');
                li2.classList.add('unMatch');
                setTimeout(function () {
                    closeUnmatchedCards()
                }, 750)
            }
            moveCounter();
            restartClick();
        }
        displaySymbol(li);
    })
};


function gameStart() {
    // we restart the variables
    restarValue();
    // we restart the click
    restartClick();
    // // we stop the time
    endOfGame();
    //  we clear the time string
    time.innerHTML = '00:00';
    // we grab all the cards
    let list = document.getElementsByClassName("deck");

    list[0].innerHTML = '';

    // We first shuffle the array of cards
    let cardsShuffled = shuffle(cardsArray);

    for (let card of cardsShuffled) {
        let li = newCard(card);
        list[0].appendChild(li);
    }

    let cards = list[0].getElementsByClassName("card") 
    for (let card of cards) {

        pickACard(card);
    }

}

gameStart();


Array.from(buttonRestart).forEach(el => {
    el.addEventListener('click', function () {
        gameStart()
    })
});

