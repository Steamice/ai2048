class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('bestScore');
        this.newGameButton = document.getElementById('newGame');
        this.hasWon = false;
        this.tileIdCounter = 0;
        this.tilePositions = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.setupTouchControls();
    }

    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.gameBoard.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.gameBoard.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    this.move('right');
                } else if (diffX < -50) {
                    this.move('left');
                }
            } else {
                if (diffY > 50) {
                    this.move('down');
                } else if (diffY < -50) {
                    this.move('up');
                }
            }
        }, { passive: true });
    }

    handleKeyDown(e) {
        const keyMap = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right'
        };

        if (keyMap[e.key]) {
            e.preventDefault();
            this.move(keyMap[e.key]);
        }
    }

    startNewGame() {
        this.board = this.createEmptyBoard();
        this.score = 0;
        this.hasWon = false;
        this.tileIdCounter = 0;
        this.tilePositions = {};
        this.addRandomTile();
        this.addRandomTile();
        this.updateUI();
    }

    createEmptyBoard() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill({ value: 0, id: null }));
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].value === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.tileIdCounter++;
            this.board[randomCell.row][randomCell.col] = {
                value: Math.random() < 0.9 ? 2 : 4,
                id: this.tileIdCounter,
                isNew: true,
                isMerged: false
            };
            this.tilePositions[this.tileIdCounter] = { row: randomCell.row, col: randomCell.col };
        }
    }

    move(direction) {
        let moved = false;
        const mergedIds = new Set();

        const processLine = (line) => {
            let newLine = line.filter(cell => cell.value !== 0);
            for (let i = 0; i < newLine.length - 1; i++) {
                if (newLine[i].value === newLine[i + 1].value) {
                    newLine[i].value *= 2;
                    this.score += newLine[i].value;
                    newLine[i].isMerged = true;
                    mergedIds.add(newLine[i].id);
                    newLine[i + 1].value = 0;
                    newLine[i + 1].id = null;
                    moved = true;
                }
            }
            newLine = newLine.filter(cell => cell.value !== 0);
            while (newLine.length < this.size) {
                newLine.push({ value: 0, id: null, isNew: false, isMerged: false });
            }
            return newLine;
        };

        const originalPositions = { ...this.tilePositions };

        if (direction === 'left') {
            for (let i = 0; i < this.size; i++) {
                const original = this.board[i].map(cell => cell.value);
                this.board[i] = processLine([...this.board[i]]);
                if (JSON.stringify(original) !== JSON.stringify(this.board[i].map(cell => cell.value))) {
                    moved = true;
                }
            }
        } else if (direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                const original = this.board[i].map(cell => cell.value);
                this.board[i] = processLine([...this.board[i]].reverse()).reverse();
                if (JSON.stringify(original) !== JSON.stringify(this.board[i].map(cell => cell.value))) {
                    moved = true;
                }
            }
        } else if (direction === 'up') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) {
                    column.push(this.board[i][j]);
                }
                const original = column.map(cell => cell.value);
                const newColumn = processLine(column);
                for (let i = 0; i < this.size; i++) {
                    this.board[i][j] = newColumn[i];
                }
                if (JSON.stringify(original) !== JSON.stringify(newColumn.map(cell => cell.value))) {
                    moved = true;
                }
            }
        } else if (direction === 'down') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) {
                    column.push(this.board[i][j]);
                }
                const original = column.map(cell => cell.value);
                const newColumn = processLine([...column].reverse()).reverse();
                for (let i = 0; i < this.size; i++) {
                    this.board[i][j] = newColumn[i];
                }
                if (JSON.stringify(original) !== JSON.stringify(newColumn.map(cell => cell.value))) {
                    moved = true;
                }
            }
        }

        if (moved) {
            this.updateTilePositions();
            this.addRandomTile();
            this.updateUIWithAnimation(originalPositions);
            this.checkWin();
            this.checkGameOver();
        }
    }

    updateTilePositions() {
        this.tilePositions = {};
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].id !== null) {
                    this.tilePositions[this.board[i][j].id] = { row: i, col: j };
                }
            }
        }
    }

    updateUIWithAnimation(originalPositions) {
        const tiles = this.gameBoard.querySelectorAll('.tile');
        const newTileIds = new Set();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    newTileIds.add(cell.id);
                }
            }
        }

        tiles.forEach(tile => {
            const tileId = parseInt(tile.dataset.tileId);
            if (!newTileIds.has(tileId)) {
                tile.remove();
            }
        });

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    let tile = this.gameBoard.querySelector(`[data-tile-id="${cell.id}"]`);
                    if (!tile) {
                        tile = document.createElement('div');
                        tile.dataset.tileId = cell.id;
                        this.gameBoard.appendChild(tile);
                    }

                    tile.className = `tile tile-${cell.value}`;
                    if (cell.isNew) {
                        tile.classList.add('tile-new');
                        cell.isNew = false;
                    }
                    if (cell.isMerged) {
                        tile.classList.add('tile-merged');
                        cell.isMerged = false;
                    }
                    tile.textContent = cell.value;

                    const isMoving = originalPositions[cell.id] &&
                        (originalPositions[cell.id].row !== i || originalPositions[cell.id].col !== j);

                    if (!isMoving) {
                        tile.style.transition = 'none';
                    } else {
                        tile.style.transition = 'left 0.15s ease, top 0.15s ease';
                    }

                    const boardWidth = this.gameBoard.clientWidth;
                    const padding = 12;
                    const gap = 12;
                    const cellWidth = (boardWidth - 2 * padding - 3 * gap) / 4;
                    tile.style.width = `${cellWidth}px`;
                    tile.style.left = `${j * (cellWidth + gap) + padding}px`;
                    tile.style.top = `${i * (cellWidth + gap) + padding}px`;
                }
            }
        }

        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore(this.bestScore);
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    updateUI() {
        this.gameBoard.innerHTML = '';

        for (let i = 0; i < this.size * this.size; i++) {
            const container = document.createElement('div');
            container.className = 'tile-container';
            this.gameBoard.appendChild(container);
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${cell.value}`;
                    if (cell.isNew) {
                        tile.classList.add('tile-new');
                        cell.isNew = false;
                    }
                    tile.textContent = cell.value;
                    tile.dataset.tileId = cell.id;

                    const boardWidth = this.gameBoard.clientWidth;
                    const padding = 12;
                    const gap = 12;
                    const cellWidth = (boardWidth - 2 * padding - 3 * gap) / 4;
                    tile.style.width = `${cellWidth}px`;
                    tile.style.left = `${j * (cellWidth + gap) + padding}px`;
                    tile.style.top = `${i * (cellWidth + gap) + padding}px`;

                    this.gameBoard.appendChild(tile);
                }
            }
        }

        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore(this.bestScore);
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    checkWin() {
        if (!this.hasWon) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (this.board[i][j].value === 2048) {
                        this.hasWon = true;
                        if (confirm('恭喜！你达到了2048！继续游戏吗？')) {
                            continue;
                        } else {
                            this.startNewGame();
                        }
                        return;
                    }
                }
            }
        }
    }

    checkGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].value === 0) {
                    return;
                }
                if (j < this.size - 1 && this.board[i][j].value === this.board[i][j + 1].value) {
                    return;
                }
                if (i < this.size - 1 && this.board[i][j].value === this.board[i + 1][j].value) {
                    return;
                }
            }
        }
        alert(`游戏结束！你的得分：${this.score}`);
        this.startNewGame();
    }

    loadBestScore() {
        const saved = localStorage.getItem('2048-best-score');
        return saved ? parseInt(saved, 10) : 0;
    }

    saveBestScore(score) {
        localStorage.setItem('2048-best-score', score.toString());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});