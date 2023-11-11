// INDEX.HTML DO PROJETO DE JOGO DO DETONA RALPH 
// POR RAFAEL_SOL_MAKER (RSM)
// EDITADO: 10/11/23

// ################### ELEMENTOS ###################

const emojis = ["🌎","🌎","🎮","🎮","🦄","🦄","😎","😎",
                "🤖","🤖","👽","👽","🐲","🐲","🐳","🐳"];

// Variáveis e constantes que controlam o estado do jogo
const gameState = {
    view: {
        cards: document.body.querySelectorAll(".card"),
        moves: document.querySelector("#game-moves"),
        timer: document.querySelector("#game-time"),       
    },
    values: { 
        moves: 0,
        currentTime: -1,
        openCards: [],
        clickedCards: [],
        openedPairs: [],
    },
    consts:{ 
        totalPairs: Math.floor(emojis.length / 2),
    },
    timers: {
        clockTimer: null, 
    }
};

function setupCards() {
    let shuffleCards = emojis.sort(()=>(Math.random() > 0.5 ? 1 : -1));
    for (let i = 0; i < emojis.length; i++) {
        let card = document.createElement("div");
        card.className = "card";
        card.id = "c" + i;

        // Classe maior
        card.addEventListener("click", checkClick.bind(this, card));
        document.querySelector(".game").append(card);

        // "Frente" da carta genérico
        let front = document.createElement("div");
        front.className = "face front";
        card.append(front);

        // Trás da carta - figuras
        let back = document.createElement("div");
        back.className = "face back";
        back.innerHTML = shuffleCards[i];
        card.append(back);

    }
}

function removeCards() {
    document.querySelectorAll(".card").forEach((card) => card.remove()) ;
}

// ################### SOM ###################

function playSound(filename, volume = 100.0, loop = false) {
    let audio = new Audio("./assets/audio/"+ filename + ".m4a");
    audio.volume = volume / 100.0;
    audio.loop = loop;
    audio.play();
}

// ################### EVENTOS ###################

function addRemainingListerners (){
    // Botão de resetar
    document.getElementById("reset-button").addEventListener("click", askReset.bind(this));
}

function askReset () {
    const reset = confirm("Tem certeza que deseja reiniciar a partida?");
    if (reset == true) {
        clearAndReset();
    }
}

function checkClick(card) {   
    const id = card.id;
    const cardsIds = gameState.values.clickedCards;
    const openPairs = gameState.values.openedPairs;
    if (gameState.values.openCards.length < 2  
        && !cardsIds.includes(id) 
        && !openPairs.includes(card.innerHTML)){
            gameState.values.openCards.push(card);
            gameState.values.clickedCards.push(id);
            increaseMoves();
            playSound("flip"); // Flip
            card.classList.toggle('flip');
            console.log('flipping', card)
    } else {
        // Não pode virar essa carta!
        setTimeout(playSound("buzzer", 70.0), 750); // Buzzer
    }
    if (gameState.values.openCards.length == 2){
        setTimeout(checkPairMatching, 500);
    }
}

function checkPairMatching() {
    const cards = gameState.values.openCards;
    let openPairs = gameState.values.openedPairs;
    if (cards.length < 2) return;
    if (cards[0].innerHTML == cards[1].innerHTML){
        // Deu Match!
        openPairs.push(cards[0].innerHTML);
        playSound("match", 70.0); 
    } else {
        // Não foi dessa vez...
        playSound("nomatch", 70.0); 
        // Roda, roda, vira...
        cards[0].classList.toggle('flip');
        cards[1].classList.toggle('flip');
    }
    // Limpa as cartas abertas
    gameState.values.openCards = [];
    gameState.values.clickedCards = [];

    // Condições de vitória
    if (openPairs.length == gameState.consts.totalPairs) {
        playSound("victory", 70.0);
        clearTimers() // evita contar o tempo
        setTimeout(victory, 4000);
    }
}

function victory() {    
    const time =  gameState.values.currentTime;
    const mins = Math.floor(time/60);
    const segs = (time % 60);
    const finalTime = String(mins).padStart(2, '0') + ":" + String(segs).padStart(2, '0');
    const moves = gameState.values.moves.toString(); 
    alert("Parabéns, você ganhou!\nSeu tempo foi de " + finalTime + 
        "!\nVocê completou em " + moves + " movimentos!");
    clearAndReset();
}

function increaseMoves() {
    gameState.values.moves++;
    let moves = gameState.values.moves.toString();
    document.querySelector("#game-moves").innerHTML = moves;
    gameState.view.moves = moves; // mais ou menos, mais ou menos funcionando...
    let cardsIds = gameState.values.clickedCards;
}

// ################### TEMPORIZADORES ###################

function updateClock() {
    gameState.values.currentTime++;
    let time =  gameState.values.currentTime;
    const mins = Math.floor(time/60);
    const segs = (time % 60);
    gameState.view.timer.innerHTML = String(mins).padStart(2, '0') + ":" + String(segs).padStart(2, '0');
}

function setupTimers (){
    gameState.timers.clockTimer = setInterval(updateClock, 1000);
}

function clearTimers () {
    clearInterval(gameState.timers.clockTimer);
}

// ################### INTERNOS ###################

function clearAndReset () {
    removeCards();
    clearTimers();
    resetGame();
}

function resetGame () {
    resetVariables();
    setupTimers();
    setupCards();
}

function resetVariables (){
    gameState.values.currentTime = -1;
    gameState.view.moves = 0;
    gameState.values.openCards = [];
    gameState.values.clickedCards = [];
    gameState.values.openedPairs = [];
    updateClock();
} 

function updateMoves () {
    let moves = gameState.values.moves.toString();
    gameState.view.moves.innerHTML = moves;
}

// ################### INIT ###################

function initialize(){
    resetGame();    
    addRemainingListerners();
}

window.addEventListener("load", initialize);