const YOUR_TURN = "O"
const YOUR_TURN_CLASS = "you"
const AI_TURN = "X"
const AI_TURN_CLASS = "ai"

const DRAW = "DRAW"
const MAX_STEPS = Math.pow(3, 2)

const hud = document.getElementById("hud");
const board = document.getElementById("board");

const cs = document.getElementsByClassName("cell");
const cells = Array.from(cs)
const cellData = Array(MAX_STEPS).fill("-")
var cellAvailable = Array(MAX_STEPS).fill("-")
var aiLevel = 1;

var isFreeze = true;
var steps = 0;

const startButton = document.getElementById("startBtn")
const resetButton = document.getElementById("resetBtn")

const prepareGame = () => {
    const aiLevelSelect = document.getElementById("difficulty");
    aiLevelSelect.disabled = false;

    cells.forEach((cell, index) => {
        cell.classList.remove(YOUR_TURN_CLASS, AI_TURN_CLASS)
        cell.innerHTML = "";
        cell.number = index;
    })

    hud.innerHTML="Choice Level"
    steps = 0;
    isFreeze = true
    startButton.disabled = false;
    // board.style.display = "none"
}

const startGame = () => {
    const aiLevelSelect = document.getElementById("difficulty");
    aiLevel = aiLevelSelect.value;
    aiLevelSelect.disabled = true;

    cells.forEach((cell, index) => {
        cell.onclick = cellClick.bind(null, cell)
        cell.classList.remove(YOUR_TURN_CLASS, AI_TURN_CLASS)
        cell.innerHTML = index + 1;
        cell.number = index;
        cellData[index] = index
        cellAvailable[index] = index
    })
    hud.innerHTML="Game Start!"
    steps = 0;
    isFreeze = false;
    startButton.disabled = true;
    // board.style.display = "grid"

}

const resetGame = () => {
    prepareGame()
}

const finishGame = (status="") => {
    isFreeze = true;
    console.log(status)
    hud.innerHTML = (status === YOUR_TURN)  ? "You Win!" : (status ===AI_TURN) ? "You Lose!" : "Draw!";

    var games = parseInt(localStorage.getItem("games")) || 0
    var wins = parseInt(localStorage.getItem("wins")) || 0
        games++;
    if(status === YOUR_TURN){
        wins++
    }
    localStorage.setItem("games", games)
    localStorage.setItem("wins", wins)

    document.getElementById("result").innerHTML = `${games} Games ${wins} Wins`
}

const cellClick = (e) => {
    var { number } = e

    if(!isFreeze && cellData[number] !== YOUR_TURN && cellData[number] !== AI_TURN){
        cellData[number] = YOUR_TURN
        cellAvailable = cellAvailable.filter(cell => cell !== number)

        cells[number].innerHTML = YOUR_TURN
        cells[number].classList.add(YOUR_TURN_CLASS)
        console.log(cellData)
        steps++;
        isFreeze = true;        
        
        if(checkBingo(cellData)){
            finishGame(YOUR_TURN)
        }else if(steps === MAX_STEPS){
            finishGame(DRAW)
        }else{
            hud.innerHTML = `Steps:${steps}`
            // AI
            setTimeout(() => { 
                var number = aiTurn();
                cellData[number] = AI_TURN
                cellAvailable = cellAvailable.filter(cell => cell !== number)

                cells[number].innerHTML = AI_TURN
                cells[number].classList.add(AI_TURN_CLASS)
                console.log(cellData)
                steps++;
    
                if(checkBingo(cellData)){
                    finishGame(AI_TURN)
                }else if(steps === MAX_STEPS){
                    finishGame(DRAW)
                }else{
                    hud.innerHTML = `Steps:${steps}`
                    isFreeze = false;
                }
                

            },1000);
        }
    }
}

const aiTurn = () => {
    var number = cellAvailable[0];
    if(aiLevel === "1"){
        number = cellAvailable[0]
    }else if(aiLevel === "2"){
        number = cellAvailable[Math.floor( Math.random() * cellAvailable.length )];
    }else{
        ;
    }

    return number;
}

const checkBingo = (array) => {
    // horizontal
    for(let i = 0; i < 3; i++){
        if(array[0 + 3*i] === array[1 + 3*i] && array[1 + 3*i] === array[2 + 3*i] && array[2 + 3*i] === array[0 + 3*i] ){
            return true;
        }
    }
    // vertical
    for(let i = 0; i < 3; i++){
        if(array[i] === array[i+3] && array[i+3] === array[i+6] && array[i+6] === array[i] ){
            return true;
        }
    }
    // diagnoal
    if(array[0] === array[4] && array[4] === array[8] && array[8] === array[0] ){
        return true;
    }
    if(array[2] === array[4] && array[4] === array[6] && array[6] === array[2] ){
        return true;
    }

    return false;
}



window.onload = () => {
    prepareGame.bind(null)

    var games = parseInt(localStorage.getItem("games")) || 0
    var wins = parseInt(localStorage.getItem("wins")) || 0
    document.getElementById("result").innerHTML = `${games} Games ${wins} Wins`
    
}

