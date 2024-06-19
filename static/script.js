document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameBoard = document.getElementById('game-board');
    const resetButton = document.querySelector('button');

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
                    resetGame();
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

    // Function to reset the game
    const resetGame = async () => {
        const response = await fetch('/reset', {
            method: 'GET'
        });

        const data = await response.json();

        if (data.status === 'reset') {
            cells.forEach(cell => {
                cell.innerText = '';
            });
        }
    };

    // Attach event listeners to cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Attach event listener to reset button
    resetButton.addEventListener('click', resetGame);
});
