document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const clearButton = document.getElementById('clear-button');
    const playerXWinsElement = document.getElementById('playerXWins');
    const playerOWinsElement = document.getElementById('playerOWins');
    let playerXWins = 0;
    let playerOWins = 0;

    // Function to handle cell click
    const handleCellClick = async (e) => {
        const cell = e.target;
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        const response = await fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ row, col })
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            const { board, current_player, winner } = data;
            updateBoard(board);

            if (winner) {
                setTimeout(() => {
                    alert(`Player ${winner} wins!`);
                    if (winner === 'X') {
                        playerXWins += 1;
                        playerXWinsElement.innerText = playerXWins;
                    } else if (winner === 'O') {
                        playerOWins += 1;
                        playerOWinsElement.innerText = playerOWins;
                    }
                    clearGameBoard();
                }, 100); // Small delay to show the last move
            }
        }
    };

    // Function to update the game board
    const updateBoard = (board) => {
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = gameBoard.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                cellElement.innerText = cell;
            });
        });
    };

    // Function to clear the game board
const clearGameBoard = async () => {
    const response = await fetch('/clear', {
        method: 'GET'
    });

    const data = await response.json();

    if (data.status === 'cleared') {
        cells.forEach(cell => {
            cell.innerText = '';
        });
    }
};

    // Function to reset the game and the scoreboard
    const resetGame = async () => {
        const response = await fetch('/reset', {
            method: 'GET'
        });

        const data = await response.json();

        if (data.status === 'reset') {
            clearGameBoard();
            playerXWins = 0;
            playerOWins = 0;
            playerXWinsElement.innerText = playerXWins;
            playerOWinsElement.innerText = playerOWins;
        }
    };

    // Attach event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Attach event listeners to buttons
    clearButton.addEventListener('click', clearGameBoard);
    resetButton.addEventListener('click', resetGame);
});
