const $ = document.querySelector.bind(document);
const $all = document.querySelectorAll.bind(document);

const board = $(".board");
const boardItems = Array.from($all(".board-item"));
const buttonsToSelectPlayer = Array.from($all(".buttons-container button"));
const playerSelection = $(".player-selection");
const winnerModal = $(".winner");
const buttonReset = $(".winner button");

let currentPlayer = null;
const MATRIX_SIZE = 3;
const PLAYERS_OPTIONS = {
    x: "x",
    o: "o"
};
const TABLE = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let board_state = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

function gameOver(isTie = false) {
    winnerModal.classList.add("game-over");   
    const message = $(".winner h1");
    message.innerHTML = isTie ?"Deu Velha!!!" : `O Jogador "${currentPlayer}" é o vencedor!!!`;
    board_state = TABLE;
}

function checkWinner(player) {
    for (const [indexItem, item] of board_state.entries()) {
        const index = indexItem % MATRIX_SIZE;
        
        const hasWinnerInRow = item.every(i => i === player);
        const hasWinnerInColumn = board_state.every(bs => bs[index] === player);
        const hasWinnerInDiagonal = board_state.every((bs, idx) => bs[idx] === player || bs[(bs.length-1) - idx] === player);

        if (hasWinnerInRow || hasWinnerInColumn || hasWinnerInDiagonal) {
            if (hasWinnerInRow) {
                if (indexItem === 0) {
                    board.classList.add("win-start");
                } else if (indexItem === 1) {
                    board.classList.add("win-center");
                } else {
                    board.classList.add("win-end");
                }
                
            }

            if (hasWinnerInDiagonal) {
                if (board_state[0][0] === player && board_state[1][1] === player && board_state[2][2] === player) {
                    board.classList.add("win-diagonal-1");
                } else {
                    board.classList.add("win-diagonal-2");
                }
            }

            gameOver();
        }

        if (!hasWinnerInRow && !hasWinnerInColumn && !hasWinnerInDiagonal && board_state.every(e => e.every(e => e.length))) {
            gameOver("tie");
        }
    }
}

function handleClickButtonReset() {
    boardItems.forEach((item)=> {
        item.innerHTML = "";
        item.classList.remove("selected");
        item.classList.remove("player-o");
        item.classList.remove("player-x");
    });
    currentPlayer = null;
    playerSelection.classList.remove("player-selected");
    board.classList.remove("playing-started");
    winnerModal.classList.remove("game-over");
    window.location.reload();
}

function handleClickBoardItem(event) {
    const item = event.target;
    if (item.textContent.length) {
        return;
    }

    const index = item.getAttribute("data-item-position");
    const [indexRow, indexColumn] = index.split("_");
    item.innerHTML = currentPlayer;
    item.classList.add("selected");
    board_state[indexRow][indexColumn] = currentPlayer;
    checkWinner(currentPlayer);
    currentPlayer = currentPlayer === PLAYERS_OPTIONS.x ? PLAYERS_OPTIONS.o : PLAYERS_OPTIONS.x;
}

function handleClickButtomToSelectPalyer(event) {
    currentPlayer = event.target.getAttribute("data-player");
    playerSelection.classList.add("player-selected");
    board.classList.add("playing-started");
}

if (buttonReset) {
    buttonReset.addEventListener("click", handleClickButtonReset);
}

if (buttonsToSelectPlayer) {
    buttonsToSelectPlayer.forEach(button => {
        button.addEventListener("click", handleClickButtomToSelectPalyer);
    });
}

if (boardItems) {
    boardItems.forEach((item, index)=> {
        /**
         * item_0_0, item_0_1, item_0_2
         * item_1_0, item_1_1, item_1_2
         * item_2_0, item_MATRIX_SIZE_1, item_4_2
         */
        const indexRow = Math.floor(index / MATRIX_SIZE);
        const indexColumn = index % MATRIX_SIZE;

        item.setAttribute("data-item-position", `${indexRow}_${indexColumn}`);

        item.setAttribute("data-item-index", index);


        item.addEventListener("click", handleClickBoardItem);

        item.addEventListener("mouseenter", function () {
            item.classList.add(`player-${currentPlayer}`);
        });
        item.addEventListener("mouseleave", function () {
            item.classList.remove(`player-${currentPlayer}`);
        });
    });
}

