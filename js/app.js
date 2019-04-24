// declarando variaveis
let card = document.getElementsByClassName("card");
let cards = [...card];
let openedCards = [];
let matchedCard = document.getElementsByClassName("match");

//variavel de movimentos do jogo
let moves = 0;

let refreshHTML = function(target, value) {
	return target.innerHTML = value;
};

// variavel de parabens
const popup = document.getElementById("parabens");

// numero de estrelas
let numEstrela = function() {
	this.stars = document.querySelectorAll(".fa-star");
};

numEstrela.prototype.rate = function() {
	if(moves > 12 && moves < 18) {
		this.stars[2].classList.remove("shine");
	} else if(moves > 18) {
		this.stars[1].classList.remove("shine");
	}
};

numEstrela.prototype.restart = function() {
	for(var i=0; i<this.stars.length; i++) {
		this.stars[i].classList.add("shine");
	}
};

let stars = new numEstrela();

// declarando tempo
const timer = document.querySelector(".timer");


// contador
let CounterSet = function(moves) {
	this.target = document.querySelector(".counter");
	refreshHTML(this.target, moves);
};

CounterSet.prototype.add = function() {
	moves++;
	refreshHTML(this.target, moves);
};

CounterSet.prototype.restart = function() {
	moves = 0;
	refreshHTML(this.target, moves);
};

let counter = new CounterSet(moves);


// declarando o tempo inicial, recebendo o valor 0
let second = {
	value: 0,
	label: " segs"
};

let minute = {
	value: 0,
	label: " mins "
};

let interval;

window.onload = startGame();

// loop para adicionar cada cartão
for(var i = 0; i < cards.length; i++) {
	cards[i].addEventListener("click", displayCard);
	cards[i].addEventListener("click", cardOpen);
	cards[i].addEventListener("click", congratulations);
}

// butão de reiniciar
document.querySelector(".restart").addEventListener("click", startGame);

// função shuffle com base em https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
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

// Iniciando Jogo
function startGame() {
	cards = shuffle(cards);
	for(var i=0; i<cards.length; i++) {
		document.querySelector(".deck").innerHTML = "";
		[].forEach.call(cards, function(item) {
			document.querySelector(".deck").appendChild(item);
		});
		cards[i].classList.remove("show", "open", "match", "disabled");
	}
	counter.restart();
	stars.restart();
	resetTimer();
}

// function para mostrar, desbilitar e abrir.
function displayCard() {
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
}

// verificação de cards.
function cardOpen() {
	openedCards.push(this);
	if(openedCards.length === 2) {
		counter.add();
		stars.rate();
		startTimer();
		if(openedCards[0].type === openedCards[1].type) {
			matched();
		} else {
			unmatched();
		}
	}
}

// Quando unir os cards certos
function matched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("match", "disabled");
		openedCards[i].classList.remove("show", "open", "no-event");
	}
	openedCards = [];
}

// Quando os cards unidos forem errados
function unmatched() {
	for(var i=0; i<openedCards.length; i++) {
		openedCards[i].classList.add("unmatched");
	}
	disable();
	setTimeout(function() {
		for(var i=0; i<openedCards.length; i++) {
			openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
		}
		enable();
		openedCards = [];
	}, 1100);
}

// desabilitando cards
function disable() {
	for(var i = 0; i < cards.length; i++) {
		cards[i].classList.add("disabled");
	}
}

// ativando os cartões, menos os combinados.
function enable() {
	for(var i = 0; i < cards.length; i++) {
		if(!cards[i].classList.contains("match")) {
			cards[i].classList.remove("disabled");
		};
	}
}

// iniciando o tempo
function startTimer() {
	if(moves == 1) {
		interval = setInterval(function() {
			second.value++;
			if(second.value == 60) {
				minute.value++;
				second.value = 0;
			}
			refreshTimer();
		}, 1000);
	}
}

// atualizar o tempo no HTML
function refreshTimer() {
	timer.innerHTML = minute.value + minute.label + second.value + second.label;
}

// resetar o tempo
function resetTimer() {
	second.value = 0;
	minute.value = 0;
	refreshTimer();
}


// congratulations popup when all cards match
function congratulations() {
	if(matchedCard.length == 16) {
		clearInterval(interval);
		popup.classList.add("show");
		document.getElementById("total-moves").innerHTML = moves;
		document.getElementById("total-time").innerHTML = timer.innerHTML;
		document.getElementById("numEstela").innerHTML = document.querySelector(".stars").innerHTML;
		closePopup();
	};
}

// close popup function on play again button
function closePopup() {
	document.getElementById("jogar-novamente").addEventListener("click", function() {
		popup.classList.remove("show");
		startGame();
	});
}
