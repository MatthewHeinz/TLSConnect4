const ROWS = 7;
const COLS = 7;
let board = [];
let currentPlayer = 1;
let gameActive = true;

const boardDiv = document.getElementById('game-board');
const statusDiv = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');

function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  boardDiv.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleCellClick);
      boardDiv.appendChild(cell);
    }
  }
}

function handleCellClick(e) {
  if (!gameActive) return;
  const col = parseInt(e.target.dataset.col);
  // Find the lowest empty cell in this column
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = currentPlayer;
      updateBoard();
      if (checkWin(row, col, currentPlayer)) {
        statusDiv.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
      } else if (isDraw()) {
        statusDiv.textContent = "It's a draw!";
        gameActive = false;
      } else {
        currentPlayer = 3 - currentPlayer;
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
      }
      return;
    }
  }
}

function updateBoard() {
  const cells = boardDiv.children;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      cells[idx].classList.remove('player1', 'player2');
      if (board[r][c] === 1) cells[idx].classList.add('player1');
      if (board[r][c] === 2) cells[idx].classList.add('player2');
    }
  }
}

function checkWin(row, col, player) {
  // Directions: horizontal, vertical, diagonal
  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 }
  ];
  for (const { dr, dc } of directions) {
    let count = 1;
    // Check one direction
    for (let i = 1; i < 4; i++) {
      const nr = row + dr * i;
      const nc = col + dc * i;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break;
      count++;
    }
    // Check the opposite direction
    for (let i = 1; i < 4; i++) {
      const nr = row - dr * i;
      const nc = col - dc * i;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break;
      count++;
    }
    if (count >= 4) return true;
  }
  return false;
}

function isDraw() {
  return board.every(row => row.every(cell => cell !== 0));
}

function resetGame() {
  currentPlayer = 1;
  gameActive = true;
  createBoard();
  statusDiv.textContent = `Player 1's turn`;
}

resetBtn.addEventListener('click', resetGame);

createBoard();
statusDiv.textContent = `Player 1's turn`; 