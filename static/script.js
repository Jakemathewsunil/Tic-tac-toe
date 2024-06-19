document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
});

function handleCellClick(event) {
    const cell = event.target;
    const row = cell.getAttribute('data-row');
    const col = cell.getAttribute('data-col');

    fetch('/move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ row: row, col: col }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else if (data.winner) {
            alert(`Player ${data.winner} wins!`);
            resetBoard();
        } else {
            updateBoard(data.board);
        }
    });
}

function updateBoard(board) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        cell.textContent = board[row][col];
    });
}

function resetBoard() {
    fetch('/reset')
    .then(() => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
        });
    });
}
