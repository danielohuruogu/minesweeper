document.addEventListener("DOMContentLoaded", () => {
///////////////////////////////////////////**************** SETTING UP GAME AREA*****************///////////////////////////////////////

var gameStarted = false;

const welcomeMessage = document.querySelector(".subHeading")
const gameBoard = document.querySelector(".board")
const gameStats = document.querySelector(".gameStats")

gameStart();

function gameStart() {
    if (!gameStarted) {
        document.addEventListener("keypress", function listener(e) {
                if (e.defaultPrevented) {
                    return;
                }
                if (e.key === "Enter"&&!gameStarted) {
                    console.log("enter key pressed");
                    welcomeMessage.classList.add("not-visible")
                    gameBoard.classList.remove("not-visible")
                    gameStats.classList.remove("not-visible")
                    createBoard();
                }
                gameStarted = true;
        })
    }
}

// createBoard();

var width = 8;

var squares = [];

var bombNumber = 0;

const bombText = document.querySelector(".bombsRemaining")

function createBoard() {
    console.log("gameboard started");

    var difficulty = 0.15625;

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
            console.log(e.target.classList);
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
            if (!isLeftEdge && i - (width + 1) > 0 && squares[i - (width + 1)].classList.contains("bomb"))
                totalBombsAround++
            // 2, N
            if (i - width > 0 && squares[i - width].classList.contains("bomb"))
                totalBombsAround++
            // 3, NE
            if (!isRightEdge && i - width + 1 > 0 && squares[i - width + 1].classList.contains("bomb"))
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
        gameOver(square) //if the square has a bomb, run the game over function
    } else { //if none of those
        let total = square.getAttribute("data") //get the 'data' attribute
        if (total != 0) { //if it's not 0 (if there are bombs nearby)
            square.innerHTML = total //change the inner html to that total
            return
        }
        square.classList.add("checked") //then add 'checked' once it's done
        console.log("checked has been added");
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
    if (!square.classList.contains("checked") && (flags < bombNumber)) {
        if (!square.classList.contains("flag")) {
            square.classList.add("flag")
            square.innerHTML = "🚩"
            flags++
            checkforWin();
        } else {
            square.classList.remove("flag")
            square.innerHTML = ""
            flags--
        }
    }
    bombText.innerHTML = "Bombs remaining: " + (bombNumber-flags) ;
}

//////////////////////////**************** END OF GAME FUNCTIONS ************//////////////////////////////////////

const gameMessage = document.querySelector(".gameMessage");

var isGameOver = false;

function gameOver(square) {
    console.log("Game over ☹");
    const endMessage_Loss = document.createElement("h3")
    endMessage_Loss.innerHTML = "Game over"
    gameMessage.appendChild(endMessage_Loss)
    isGameOver = true;

    squares.forEach(square => {
        if (square.classList.contains("bomb")) {
            square.innerHTML = "💣"
        }
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
    }
}

})