
///////////////////////////////////////////**************** SETTING UP GAME AREA*****************///////////////////////////////////////

var gameStarted = false;

const welcomeMessage = document.querySelector(".subHeading")
const gameBoard = document.querySelector(".board")
const gameStats = document.querySelector(".gameStats")
const gameArea = document.querySelector(".gameArea")
//  const refreshButton = document.querySelector("button")

const difBtns = document.querySelectorAll(".difBtn")

////////// difficulty booleans

var isEasy = false;
var isMed = false;
var isHard = false;

var difficulty
var width
var squares = [];

gameStart();

function gameStart() {
    if (!gameStarted) {
        for (var difBtn of difBtns) {
            difBtn.addEventListener("click", function listener(e) {
                    welcomeMessage.classList.add("not-visible")
                    gameArea.classList.remove("not-visible")
                    setDifficulty(e)
                    createBoard();
                })
                gameStarted = true;
            }
        }
}

function setDifficulty(event) {
    if (event.target.classList.contains("easyBtn")) {
        isEasy = true;
        width = 8;
        difficulty = 0.15625
        gameBoard.classList.add("easy")
    }
    if (event.target.classList.contains("medBtn")) {
        isMed = true;
        width = 16;
        difficulty = 0.2;
        gameBoard.classList.add("medium")
    }
    if (event.target.classList.contains("hardBtn")) {
        isHard = true;
        width = 25;
        difficulty = 0.2;
        gameBoard.classList.add("hard")
    }
}

// var opacity = 0; 
// var intervalID = 0; 
// window.onload = fadeIn; 
// I don't want this. I want fadeIn to happen once I've clicked a difficulty
  
// function fadeIn() { 
//    setInterval(show, 200); 
// } 

// function show() { 
//     var body = document.getElementById("body"); 
//     opacity = Number(window.getComputedStyle(body).getPropertyValue("opacity")); 
//     if (opacity < 1) { 
//         opacity = opacity + 0.1; 
//         body.style.opacity = opacity 
//     } else { 
//         clearInterval(intervalID); 
//     } 
// } 

var bombNumber = 0;

const bombText = document.querySelector(".bombsRemaining")

function createBoard() {

    // setting the squares up
    for (var i = 0; i < width * width; i++) {
        const square = document.createElement("div")
        square.classList.add("square")
        square.setAttribute("id", i)
        if (Math.random() < difficulty) { //adding bombs to a square depending on whether a random number is generated below a threshold
            square.classList.add("bomb")
            bombNumber++
        } else {
            square.classList.add("noBomb")
        }
        gameBoard.appendChild(square)
        squares.push(square)

        //normal click
        square.addEventListener("click", function(e) { //on a click action, run 
            squareClick(square) //run function passing through square
        })

        //right click
        square.oncontextmenu = function(e) {
            e.preventDefault()
            addFlag(square)
        }
    }
    bombText.innerHTML = "Bombs remaining: " + bombNumber;


    //getting the numbers of bombs around each square
    for (var i = 0; i < squares.length; i++) {
        let totalBombsAround = 0
        const isLeftEdge = (i % width === 0) //boundary condition
        const isRightEdge = (i % width === width - 1) //boundary condition

        if (squares[i].classList.contains("noBomb")) {
            // 1, NW
            if (!isLeftEdge && i - (width + 1) > -1 && squares[i - (width + 1)].classList.contains("bomb"))
                totalBombsAround++
            // 2, N
            if (i - width > -1 && squares[i - width].classList.contains("bomb"))
                totalBombsAround++
            // 3, NE
            if (!isRightEdge && i - width + 1 > -1 && squares[i - width + 1].classList.contains("bomb"))
                totalBombsAround++
            // 4, W
            if (!isLeftEdge && squares[i - 1].classList.contains("bomb"))
                totalBombsAround++
            // 5, E
            if (!isRightEdge && squares[i + 1].classList.contains("bomb"))
                totalBombsAround++
            // 6, SW
            if (!isLeftEdge && i + width - 1 < squares.length && squares[i + width - 1].classList.contains("bomb"))
                totalBombsAround++
            // 7, S
            if (i + width < squares.length && squares[i + width].classList.contains("bomb"))
                totalBombsAround++
            // 8, SE
            if (!isRightEdge && i + width + 1 < squares.length && squares[i + width + 1].classList.contains("bomb"))
                totalBombsAround++

            squares[i].setAttribute("data", totalBombsAround)
        }
    }

}

//////////////////////////////////////////****************** IN GAME FUNCTIONALITY **********************//////////////////////////////

//click on square actions
function squareClick(square) {
    var currentId = square.id;
    if (isGameOver) return //if the game's done, do nothing
    if (square.classList.contains("checked") || square.classList.contains("flag")) return //if the squares been checked or has a flag, do nothing
    if (square.classList.contains("bomb")) {
        gameOver(currentId) //if the square has a bomb, run the game over function
    } else { //if none of those
        square.classList.add("checked") // add 'checked' once it's done
        let total = square.getAttribute("data") //get the 'data' attribute
        if (total == 0) { //
            square.classList.add("emptyCheckedSquare")
        } else {
            if (total == 1) square.classList.add("blue")
            if (total == 2) square.classList.add("green")
            if (total == 3) square.classList.add("red")
            if (total == 4) square.classList.add("purple")
            if (total == 5) square.classList.add("brown")
            if (total == 6) square.classList.add("yellow")
            if (total == 7) square.classList.add("turquoise")
            if (total == 8) square.classList.add("pink")
            square.innerHTML = total //change the inner html to that total
            return
        }
        
        checkNeighbour(currentId) //check the neighbour of the current square
    }
}

//check neighbouring squares once square has been clicked
function checkNeighbour(currentId) {
    const isLeftEdge = (currentId % width === 0) //boundary condition
    const isRightEdge = (currentId % width === width - 1) //boundary condition

    setTimeout(()=>{
        // 1, NW
        if (!isLeftEdge && currentId - width - 1 > 0) {
            const newId = squares[parseInt(currentId) - width - 1].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 2, N
        if (currentId - width > 0) {
            const newId = squares[parseInt(currentId) - width].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 3, NE
        if (!isRightEdge && currentId - width + 1 > 0) {
            const newId = squares[parseInt(currentId) - width + 1].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 4, W
        if (!isLeftEdge) {
            const newId = squares[parseInt(currentId) - 1].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 5, E
        if (!isRightEdge) {
            const newId = squares[parseInt(currentId) + 1].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 6, SW
        if (!isLeftEdge && currentId + width - 1 < squares.length) {
            const newId = squares[parseInt(currentId) + width - 1].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 7, S
        if (currentId + width < squares.length) {
            const newId = squares[parseInt(currentId) + width].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
        // 8, SE
        if (!isRightEdge && currentId + width + 1 < squares.length) {
            const newId = squares[parseInt(currentId) + width + 1].id;
            const newSquare = document.getElementById(newId)
            squareClick(newSquare)
        }
    }, 30)
}

var flags = 0;

function addFlag(square) {
    if (isGameOver) return
    if (!square.classList.contains("checked")) {
        if (!square.classList.contains("flag")) {
            square.classList.add("flag")
            square.innerHTML = "🚩"
            flags++
            checkforWin();
        } else {
            square.classList.remove("flag")
            square.innerHTML = ""
            flags--
            checkforWin();
        }
    }
    
    bombsRemaining = bombNumber - flags;
    bombText.innerHTML = "Bombs remaining: " + (bombsRemaining);
    const warning = document.querySelector(".warning")
    if (!isGameOver) {
        warning.classList.toggle("not-visible", bombsRemaining > 0)
    }
}

//////////////////////////**************** END OF GAME FUNCTIONS ************//////////////////////////////////////

const gameMessage = document.querySelector(".gameMessage");

var isGameOver = false;

function gameOver(squareId) {
    const endMessage_Loss = document.createElement("h3")
    endMessage_Loss.innerHTML = "Game over"
    gameMessage.appendChild(endMessage_Loss)
    isGameOver = true;

    squares.forEach(square => {
        setTimeout(() => {
            document.getElementById(squareId).classList.add("wrongSquare")
            if (square.classList.contains("bomb")) {
                square.innerHTML = "💣"
            }
        }, 50)
        setTimeout(() => {
            let bombCount = square.getAttribute("data")
                if (!square.classList.contains("flag") && !square.classList.contains("bomb")) {
                    if (bombCount == 0) {
                        square.classList.add("emptyCheckedSquare")
                    } else {
                        if (bombCount == 1) square.classList.add("blue")
                        if (bombCount == 2) square.classList.add("green")
                        if (bombCount == 3) square.classList.add("red")
                        if (bombCount == 4) square.classList.add("purple")
                        if (bombCount == 5) square.classList.add("brown")
                        if (bombCount == 6) square.classList.add("yellow")
                        if (bombCount == 7) square.classList.add("turquoise")
                        if (bombCount == 8) square.classList.add("pink")
                        square.innerHTML = bombCount;
                    }
                }
        }, 250)
    })
}

function checkforWin() {
    var matches = 0;

    for (var i = 0; i<squares.length; i++) {
        if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
            matches++
        }
    }

    if (matches === bombNumber) {
        const endMessage_Win = document.createElement("h3");
        endMessage_Win.innerHTML = "Found all the bombs. You win"
        gameMessage.appendChild(endMessage_Win)
        isGameOver = true;
        squares.forEach(square => {
            setTimeout(() => {
                let bombCount = square.getAttribute("data")
                if (!square.classList.contains("flag") && !square.classList.contains("bomb")) {
                    if (bombCount == 0) {
                        square.classList.add("emptyCheckedSquare")
                    } else {
                        if (bombCount == 1) square.classList.add("blue")
                        if (bombCount == 2) square.classList.add("green")
                        if (bombCount == 3) square.classList.add("red")
                        if (bombCount == 4) square.classList.add("purple")
                        if (bombCount == 5) square.classList.add("brown")
                        if (bombCount == 6) square.classList.add("yellow")
                        if (bombCount == 7) square.classList.add("turquoise")
                        if (bombCount == 8) square.classList.add("pink")
                        square.innerHTML = bombCount;
                    }
                }
            }, 200)
        })
    }
}