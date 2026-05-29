/**
 * 游戏站点主类
 * 负责管理游戏合集页面的整体流程，包括游戏卡片点击、模态框显示、游戏渲染等
 */
class GameSite {
    /**
     * 构造函数：初始化DOM元素引用
     */
    constructor() {
        this.gamesGrid = document.getElementById('gamesGrid');  // 游戏卡片网格容器
        this.gameModal = document.getElementById('gameModal');    // 游戏模态框
        this.gameContent = document.getElementById('gameContent'); // 游戏内容容器
        this.closeBtn = document.getElementById('closeBtn');       // 关闭按钮
        this.currentGame = null;         // 当前运行的游戏名称
        this.currentGameInstance = null; // 当前游戏实例
        this.init();
    }

    /**
     * 初始化方法：设置事件监听器
     */
    init() {
        // 为每个游戏卡片添加点击事件
        this.gamesGrid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameName = card.dataset.game;
                this.openGame(gameName);
            });
        });

        // 关闭按钮点击事件
        this.closeBtn.addEventListener('click', () => this.closeGame());
        
        // 点击模态框背景关闭游戏
        this.gameModal.addEventListener('click', (e) => {
            if (e.target === this.gameModal) {
                this.closeGame();
            }
        });
    }

    /**
     * 打开指定游戏
     * @param {string} gameName - 游戏名称
     */
    openGame(gameName) {
        this.gameModal.classList.add('active'); // 显示模态框
        this.currentGame = gameName;           // 记录当前游戏
        this.renderGame(gameName);             // 渲染游戏
        document.body.style.overflow = 'hidden'; // 禁止页面滚动
    }

    /**
     * 关闭当前游戏
     */
    closeGame() {
        this.gameModal.classList.remove('active'); // 隐藏模态框
        this.gameContent.innerHTML = '';           // 清空游戏内容
        
        // 如果当前游戏有移除事件监听器的方法，调用它
        if (this.currentGameInstance && typeof this.currentGameInstance.removeEventListeners === 'function') {
            this.currentGameInstance.removeEventListeners();
        }
        
        this.currentGame = null;         // 重置当前游戏名称
        this.currentGameInstance = null; // 重置当前游戏实例
        document.body.style.overflow = ''; // 恢复页面滚动
    }

    /**
     * 根据游戏名称渲染对应的游戏
     * @param {string} gameName - 游戏名称
     */
    renderGame(gameName) {
        switch(gameName) {
            case '2048':
                this.render2048();
                break;
            case 'snake':
                this.renderSnake();
                break;
            case 'tetris':
                this.renderTetris();
                break;
            case 'breakout':
                this.renderBreakout();
                break;
            case 'tic-tac-toe':
                this.renderTicTacToe();
                break;
            case 'memory':
                this.renderMemory();
                break;
            case 'whack-a-mole':
                this.renderWhackAMole();
                break;
            case 'sokoban':
                this.renderSokoban();
                break;
            case 'guess-number':
                this.renderGuessNumber();
                break;
            case 'match-three':
                this.renderMatchThree();
                break;
        }
    }

    render2048() {
        this.gameContent.innerHTML = `
            <div class="game-2048-container">
                <div class="container">
                    <div class="header">
                        <h1 class="title">2048</h1>
                        <div class="scores">
                            <div class="score-box">
                                <div class="label">得分</div>
                                <div class="score" id="score2048">0</div>
                            </div>
                            <div class="score-box best">
                                <div class="label">最佳</div>
                                <div class="score" id="bestScore2048">0</div>
                            </div>
                        </div>
                    </div>
                    <div class="sub-header">
                        <div class="new-game" id="newGame2048">新游戏</div>
                        <p class="subtitle">合并数字，达到2048!</p>
                    </div>
                    <div class="game-board" id="gameBoard2048"></div>
                    <p class="instructions">游戏玩法：使用方向键移动方块。当两个相同数字的方块相遇时，它们会合并成一个!直到完成2048！</p>
                </div>
            </div>
        `;
        this.currentGameInstance = new Game2048ForSite();
    }

    renderSnake() {
        this.gameContent.innerHTML = `
            <div class="game-snake-container">
                <h2>🐍 贪吃蛇</h2>
                <div class="score-display">得分: <span id="snakeScore">0</span></div>
                <canvas id="snakeCanvas" width="400" height="400"></canvas>
                <div class="game-controls">
                    <button class="btn" id="snakeStart">开始游戏</button>
                </div>
                <p style="margin-top: 15px; color: #666;">使用方向键控制蛇的移动</p>
            </div>
        `;
        this.currentGameInstance = new SnakeGame();
    }

    renderTetris() {
        this.gameContent.innerHTML = `
            <div class="game-tetris-container">
                <h2>🧱 俄罗斯方块</h2>
                <div class="score-display">得分: <span id="tetrisScore">0</span> | 等级: <span id="tetrisLevel">1</span></div>
                <canvas id="tetrisCanvas" width="300" height="600"></canvas>
                <div class="game-controls">
                    <button class="btn" id="tetrisStart">开始游戏</button>
                </div>
                <p style="margin-top: 15px; color: #666;">← → 移动 | ↑ 旋转 | ↓ 加速</p>
            </div>
        `;
        this.currentGameInstance = new TetrisGame();
    }

    renderBreakout() {
        this.gameContent.innerHTML = `
            <div class="game-breakout-container">
                <h2>🏓 打砖块</h2>
                <div class="score-display">得分: <span id="breakoutScore">0</span></div>
                <canvas id="breakoutCanvas" width="400" height="500"></canvas>
                <div class="game-controls">
                    <button class="btn" id="breakoutStart">开始游戏</button>
                </div>
                <p style="margin-top: 15px; color: #666;">使用 ← → 方向键控制挡板</p>
            </div>
        `;
        this.currentGameInstance = new BreakoutGame();
    }

    renderTicTacToe() {
        this.gameContent.innerHTML = `
            <div style="text-align: center;">
                <h2>⭕❌ 井字棋</h2>
                <div class="score-display">当前玩家: <span id="tttPlayer">X</span></div>
                <div class="tic-tac-toe-board" id="tttBoard"></div>
                <div class="game-controls">
                    <button class="btn" id="tttReset">重新开始</button>
                </div>
            </div>
        `;
        this.currentGameInstance = new TicTacToeGame();
    }

    renderMemory() {
        this.gameContent.innerHTML = `
            <div class="game-memory-container">
                <h2>🃏 记忆翻牌</h2>
                <div class="score-display">移动次数: <span id="memoryMoves">0</span></div>
                <div class="memory-grid" id="memoryGrid"></div>
                <div class="game-controls">
                    <button class="btn" id="memoryReset">重新开始</button>
                </div>
            </div>
        `;
        this.currentGameInstance = new MemoryGame();
    }

    renderWhackAMole() {
        this.gameContent.innerHTML = `
            <div class="game-whack-container">
                <h2>🔨 打地鼠</h2>
                <div class="score-display">得分: <span id="whackScore">0</span> | 时间: <span id="whackTime">30</span>秒</div>
                <div class="whack-grid" id="whackGrid"></div>
                <div class="game-controls">
                    <button class="btn" id="whackStart">开始游戏</button>
                </div>
            </div>
        `;
        this.currentGameInstance = new WhackAMoleGame();
    }

    renderSokoban() {
        this.gameContent.innerHTML = `
            <div class="game-sokoban-container">
                <h2>📦 推箱子</h2>
                <div class="score-display">关卡: <span id="sokobanLevel">1</span></div>
                <div class="sokoban-board" id="sokobanBoard"></div>
                <div class="game-controls">
                    <button class="btn" id="sokobanReset">重置关卡</button>
                    <button class="btn" id="sokobanPrev">上一关</button>
                    <button class="btn" id="sokobanNext">下一关</button>
                </div>
                <p style="margin-top: 15px; color: #666;">使用方向键推箱子到目标位置</p>
            </div>
        `;
        this.currentGameInstance = new SokobanGame();
    }

    renderGuessNumber() {
        this.gameContent.innerHTML = `
            <div class="guess-container">
                <h2>🔢 数字猜谜</h2>
                <p style="margin: 20px 0; color: #666;">我想了一个1-100之间的数字，你能猜到吗？</p>
                <input type="number" class="guess-input" id="guessInput" placeholder="输入数字">
                <div class="game-controls">
                    <button class="btn" id="guessBtn">猜!</button>
                    <button class="btn" id="guessReset">新游戏</button>
                </div>
                <p id="guessResult" style="margin-top: 20px; font-size: 1.2em;"></p>
                <p style="margin-top: 10px; color: #666;">猜测次数: <span id="guessCount">0</span></p>
            </div>
        `;
        this.currentGameInstance = new GuessNumberGame();
    }

    renderMatchThree() {
        this.gameContent.innerHTML = `
            <div class="game-match-container">
                <h2>💎 消消乐</h2>
                <div class="score-display">得分: <span id="matchScore">0</span></div>
                <div class="match-grid" id="matchGrid"></div>
                <div class="game-controls">
                    <button class="btn" id="matchReset">重新开始</button>
                </div>
                <p style="margin-top: 15px; color: #666;">点击两个相邻的宝石交换，三个或更多相同宝石连成一线即可消除</p>
            </div>
        `;
        this.currentGameInstance = new MatchThreeGame();
    }
}

class Game2048ForSite {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.gameBoard = document.getElementById('gameBoard2048');
        this.scoreElement = document.getElementById('score2048');
        this.bestScoreElement = document.getElementById('bestScore2048');
        this.newGameButton = document.getElementById('newGame2048');
        this.hasWon = false;
        this.tileIdCounter = 0;
        this.tilePositions = {};
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        document.addEventListener('keydown', this.keyHandler);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
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
        const board = [];
        for (let i = 0; i < this.size; i++) {
            board[i] = [];
            for (let j = 0; j < this.size; j++) {
                board[i][j] = { value: 0, id: null, isNew: false, isMerged: false };
            }
        }
        return board;
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
        const processLine = (line) => {
            let newLine = line.filter(cell => cell.value !== 0);
            for (let i = 0; i < newLine.length - 1; i++) {
                if (newLine[i].value === newLine[i + 1].value) {
                    newLine[i].value *= 2;
                    this.score += newLine[i].value;
                    newLine[i].isMerged = true;
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
            this.updateUI();
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
                    if (cell.isMerged) {
                        tile.classList.add('tile-merged');
                        cell.isMerged = false;
                    }
                    tile.textContent = cell.value;
                    tile.dataset.tileId = cell.id;
                    const boardWidth = this.gameBoard.clientWidth || 400;
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
                            return;
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
                if (this.board[i][j].value === 0) return;
                if (j < this.size - 1 && this.board[i][j].value === this.board[i][j + 1].value) return;
                if (i < this.size - 1 && this.board[i][j].value === this.board[i + 1][j].value) return;
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

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.score = 0;
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.food = this.generateFood();
        this.gameRunning = false;
        this.gameLoop = null;
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    init() {
        document.getElementById('snakeStart').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.keyHandler);
        this.draw();
    }

    handleKeyDown(e) {
        if (!this.gameRunning) return;
        const keyMap = {
            ArrowUp: {x: 0, y: -1},
            ArrowDown: {x: 0, y: 1},
            ArrowLeft: {x: -1, y: 0},
            ArrowRight: {x: 1, y: 0}
        };
        if (keyMap[e.key]) {
            e.preventDefault();
            const newDir = keyMap[e.key];
            if (this.snake.length > 1) {
                if (newDir.x !== -this.direction.x || newDir.y !== -this.direction.y) {
                    this.direction = newDir;
                }
            } else {
                this.direction = newDir;
            }
        }
    }

    startGame() {
        if (this.gameRunning) return;
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.score = 0;
        this.food = this.generateFood();
        this.gameRunning = true;
        document.getElementById('snakeScore').textContent = this.score;
        this.gameLoop = setInterval(() => this.update(), 100);
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    update() {
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            this.gameOver();
            return;
        }
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snakeScore').textContent = this.score;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#27ae60';
        for (let segment of this.snake) {
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        }
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        setTimeout(() => {
            alert(`游戏结束！得分：${this.score}`);
        }, 50);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}

class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.board = [];
        this.score = 0;
        this.level = 1;
        this.pieces = [
            [[1,1,1,1]],
            [[1,1],[1,1]],
            [[1,1,1],[0,1,0]],
            [[1,1,1],[1,0,0]],
            [[1,1,1],[0,0,1]],
            [[1,1,0],[0,1,1]],
            [[0,1,1],[1,1,0]]
        ];
        this.colors = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];
        this.currentPiece = null;
        this.currentPos = {x: 0, y: 0};
        this.currentColor = '';
        this.gameRunning = false;
        this.gameLoop = null;
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    init() {
        document.getElementById('tetrisStart').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.keyHandler);
    }

    handleKeyDown(e) {
        if (!this.gameRunning) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.movePiece(-1, 0);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.movePiece(1, 0);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.movePiece(0, 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.rotatePiece();
        }
    }

    startGame() {
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
        this.score = 0;
        this.level = 1;
        this.gameRunning = true;
        document.getElementById('tetrisScore').textContent = this.score;
        document.getElementById('tetrisLevel').textContent = this.level;
        this.spawnPiece();
        this.gameLoop = setInterval(() => this.update(), Math.max(100, 500 - (this.level - 1) * 50));
    }

    spawnPiece() {
        const index = Math.floor(Math.random() * this.pieces.length);
        this.currentPiece = this.pieces[index].map(row => [...row]);
        this.currentColor = this.colors[index];
        this.currentPos = {x: Math.floor(this.cols / 2) - Math.floor(this.currentPiece[0].length / 2), y: 0};
        if (this.checkCollision()) {
            this.gameOver();
        }
        this.draw();
    }

    movePiece(dx, dy) {
        this.currentPos.x += dx;
        this.currentPos.y += dy;
        if (this.checkCollision()) {
            this.currentPos.x -= dx;
            this.currentPos.y -= dy;
            if (dy > 0) {
                this.lockPiece();
            }
        }
        this.draw();
    }

    rotatePiece() {
        if (!this.currentPiece) return;
        const oldPiece = this.currentPiece.map(row => [...row]);
        this.currentPiece = this.currentPiece[0].map((_, i) =>
            this.currentPiece.map(row => row[i]).reverse()
        );
        if (this.checkCollision()) {
            this.currentPiece = oldPiece;
        }
        this.draw();
    }

    checkCollision() {
        if (!this.currentPiece) return false;
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const newX = this.currentPos.x + x;
                    const newY = this.currentPos.y + y;
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) return true;
                    if (newY >= 0 && this.board[newY][newX]) return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    this.board[this.currentPos.y + y][this.currentPos.x + x] = this.currentColor;
                }
            }
        }
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== null)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(null));
                linesCleared++;
                y++;
            }
        }
        if (linesCleared > 0) {
            this.score += linesCleared * 100 * linesCleared;
            this.level = Math.floor(this.score / 500) + 1;
            document.getElementById('tetrisScore').textContent = this.score;
            document.getElementById('tetrisLevel').textContent = this.level;
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), Math.max(100, 500 - (this.level - 1) * 50));
        }
    }

    update() {
        this.movePiece(0, 1);
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize - 1, this.gridSize - 1);
                }
            }
        }
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentColor;
            for (let y = 0; y < this.currentPiece.length; y++) {
                for (let x = 0; x < this.currentPiece[y].length; x++) {
                    if (this.currentPiece[y][x]) {
                        this.ctx.fillRect((this.currentPos.x + x) * this.gridSize, (this.currentPos.y + y) * this.gridSize, this.gridSize - 1, this.gridSize - 1);
                    }
                }
            }
        }
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        alert(`游戏结束！得分：${this.score}`);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}

class BreakoutGame {
    constructor() {
        this.canvas = document.getElementById('breakoutCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.paddle = {x: 175, y: 470, width: 60, height: 10, speed: 5};
        this.ball = {x: 200, y: 450, dx: 3, dy: -3, radius: 8};
        this.bricks = [];
        this.score = 0;
        this.gameRunning = false;
        this.keys = {};
        this.keyDownHandler = (e) => { this.keys[e.key] = true; };
        this.keyUpHandler = (e) => { this.keys[e.key] = false; };
        this.init();
    }

    init() {
        document.getElementById('breakoutStart').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
    }

    startGame() {
        this.bricks = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                this.bricks.push({x: col * 50 + 5, y: row * 25 + 30, width: 45, height: 20, alive: true});
            }
        }
        this.paddle.x = 175;
        this.ball.x = 200;
        this.ball.y = 450;
        this.ball.dx = 3;
        this.ball.dy = -3;
        this.score = 0;
        this.gameRunning = true;
        document.getElementById('breakoutScore').textContent = this.score;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameRunning) return;
        if (this.keys['ArrowLeft'] && this.paddle.x > 0) this.paddle.x -= this.paddle.speed;
        if (this.keys['ArrowRight'] && this.paddle.x < this.canvas.width - this.paddle.width) this.paddle.x += this.paddle.speed;
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        if (this.ball.x <= 0 || this.ball.x >= this.canvas.width) this.ball.dx = -this.ball.dx;
        if (this.ball.y <= 0) this.ball.dy = -this.ball.dy;
        if (this.ball.y >= this.canvas.height) {
            this.gameOver();
            return;
        }
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            this.ball.dy = -Math.abs(this.ball.dy);
            this.ball.dx += (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / 20;
        }
        for (let brick of this.bricks) {
            if (brick.alive &&
                this.ball.x >= brick.x &&
                this.ball.x <= brick.x + brick.width &&
                this.ball.y >= brick.y &&
                this.ball.y <= brick.y + brick.height) {
                this.ball.dy = -this.ball.dy;
                brick.alive = false;
                this.score += 10;
                document.getElementById('breakoutScore').textContent = this.score;
            }
        }
        if (this.bricks.every(b => !b.alive)) {
            this.gameWin();
            return;
        }
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    draw() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];
            if (brick.alive) {
                this.ctx.fillStyle = colors[Math.floor(i / 8) % colors.length];
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        }
    }

    gameOver() {
        this.gameRunning = false;
        alert(`游戏结束！得分：${this.score}`);
    }

    gameWin() {
        this.gameRunning = false;
        alert(`恭喜！你赢了！得分：${this.score}`);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
    }
}

class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.init();
    }

    init() {
        this.renderBoard();
        document.getElementById('tttReset').addEventListener('click', () => this.resetGame());
    }

    renderBoard() {
        const boardEl = document.getElementById('tttBoard');
        boardEl.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'ttt-cell';
            if (this.board[i]) {
                cell.classList.add(this.board[i].toLowerCase());
                cell.textContent = this.board[i];
            }
            cell.addEventListener('click', () => this.makeMove(i));
            boardEl.appendChild(cell);
        }
    }

    makeMove(index) {
        if (this.board[index] || this.gameOver) return;
        this.board[index] = this.currentPlayer;
        this.renderBoard();
        if (this.checkWin()) {
            alert(`玩家 ${this.currentPlayer} 获胜！`);
            this.gameOver = true;
            return;
        }
        if (this.board.every(cell => cell)) {
            alert('平局！');
            this.gameOver = true;
            return;
        }
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('tttPlayer').textContent = this.currentPlayer;
    }

    checkWin() {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let line of lines) {
            if (this.board[line[0]] &&
                this.board[line[0]] === this.board[line[1]] &&
                this.board[line[1]] === this.board[line[2]]) {
                return true;
            }
        }
        return false;
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        document.getElementById('tttPlayer').textContent = this.currentPlayer;
        this.renderBoard();
    }
}

class MemoryGame {
    constructor() {
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.symbols = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🍍'];
        this.init();
    }

    init() {
        this.shuffleCards();
        this.renderCards();
        document.getElementById('memoryReset').addEventListener('click', () => this.resetGame());
    }

    shuffleCards() {
        this.cards = [...this.symbols, ...this.symbols];
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        document.getElementById('memoryMoves').textContent = this.moves;
    }

    renderCards() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        for (let i = 0; i < this.cards.length; i++) {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = i;
            card.textContent = '?';
            card.addEventListener('click', () => this.flipCard(i));
            grid.appendChild(card);
        }
    }

    flipCard(index) {
        if (this.flipped.length >= 2 || this.flipped.includes(index) || this.matched.includes(index)) return;
        const cards = document.querySelectorAll('.memory-card');
        cards[index].classList.add('flipped');
        cards[index].textContent = this.cards[index];
        this.flipped.push(index);
        if (this.flipped.length === 2) {
            this.moves++;
            document.getElementById('memoryMoves').textContent = this.moves;
            if (this.cards[this.flipped[0]] === this.cards[this.flipped[1]]) {
                this.matched.push(...this.flipped);
                cards[this.flipped[0]].classList.add('matched');
                cards[this.flipped[1]].classList.add('matched');
                this.flipped = [];
                if (this.matched.length === this.cards.length) {
                    setTimeout(() => alert(`恭喜！你用了 ${this.moves} 步完成！`), 300);
                }
            } else {
                setTimeout(() => {
                    cards[this.flipped[0]].classList.remove('flipped');
                    cards[this.flipped[0]].textContent = '?';
                    cards[this.flipped[1]].classList.remove('flipped');
                    cards[this.flipped[1]].textContent = '?';
                    this.flipped = [];
                }, 1000);
            }
        }
    }

    resetGame() {
        this.shuffleCards();
        this.renderCards();
    }
}

class WhackAMoleGame {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameRunning = false;
        this.timer = null;
        this.moleTimer = null;
        this.init();
    }

    init() {
        this.renderGrid();
        document.getElementById('whackStart').addEventListener('click', () => this.startGame());
    }

    renderGrid() {
        const grid = document.getElementById('whackGrid');
        grid.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'whack-hole';
            const mole = document.createElement('div');
            mole.className = 'whack-mole';
            mole.textContent = '🦔';
            mole.addEventListener('click', () => this.whackMole(i));
            hole.appendChild(mole);
            grid.appendChild(hole);
        }
    }

    startGame() {
        if (this.gameRunning) return;
        this.score = 0;
        this.timeLeft = 30;
        this.gameRunning = true;
        document.getElementById('whackScore').textContent = this.score;
        document.getElementById('whackTime').textContent = this.timeLeft;
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('whackTime').textContent = this.timeLeft;
            if (this.timeLeft <= 0) this.gameOver();
        }, 1000);
        this.showMole();
    }

    showMole() {
        if (!this.gameRunning) return;
        const moles = document.querySelectorAll('.whack-mole');
        moles.forEach(m => m.classList.remove('active'));
        const randomIndex = Math.floor(Math.random() * 9);
        moles[randomIndex].classList.add('active');
        this.moleTimer = setTimeout(() => this.showMole(), 600 + Math.random() * 400);
    }

    whackMole(index) {
        if (!this.gameRunning) return;
        const moles = document.querySelectorAll('.whack-mole');
        if (moles[index].classList.contains('active')) {
            this.score += 10;
            document.getElementById('whackScore').textContent = this.score;
            moles[index].classList.remove('active');
        }
    }

    gameOver() {
        this.gameRunning = false;
        clearInterval(this.timer);
        clearTimeout(this.moleTimer);
        document.querySelectorAll('.whack-mole').forEach(m => m.classList.remove('active'));
        alert(`游戏结束！得分：${this.score}`);
    }
}

class SokobanGame {
    constructor() {
        this.levels = [
            [
                "########",
                "#  .   #",
                "# $@   #",
                "#  .   #",
                "########"
            ],
            [
                "  ####  ",
                "###  ###",
                "#  $@.#",
                "### $###",
                "  #  #  ",
                "  ####  "
            ],
            [
                "  ######",
                "  #    #",
                "### $$ #",
                "#  .@. #",
                "#  .   #",
                "########"
            ]
        ];
        this.currentLevel = 0;
        this.board = [];
        this.playerPos = {x: 0, y: 0};
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    init() {
        this.loadLevel(this.currentLevel);
        document.getElementById('sokobanReset').addEventListener('click', () => this.loadLevel(this.currentLevel));
        document.getElementById('sokobanPrev').addEventListener('click', () => this.prevLevel());
        document.getElementById('sokobanNext').addEventListener('click', () => this.nextLevel());
        document.addEventListener('keydown', this.keyHandler);
    }

    loadLevel(levelIndex) {
        const level = this.levels[levelIndex];
        this.board = level.map(row => row.split(''));
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x] === '@') {
                    this.playerPos = {x, y};
                }
            }
        }
        document.getElementById('sokobanLevel').textContent = levelIndex + 1;
        this.renderBoard();
    }

    renderBoard() {
        const boardEl = document.getElementById('sokobanBoard');
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${this.board[0].length}, 40px)`;
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'sokoban-cell';
                const char = this.levels[this.currentLevel][y][x];
                const currentChar = this.board[y][x];
                if (char === '#' || currentChar === '#') {
                    cell.classList.add('sokoban-wall');
                } else {
                    cell.classList.add(char === '.' ? 'sokoban-target' : 'sokoban-floor');
                }
                if (currentChar === '$') {
                    const box = document.createElement('div');
                    box.className = 'sokoban-box';
                    box.style.width = '30px';
                    box.style.height = '30px';
                    box.style.borderRadius = '4px';
                    cell.appendChild(box);
                } else if (currentChar === '@') {
                    const player = document.createElement('div');
                    player.className = 'sokoban-player';
                    player.style.width = '30px';
                    player.style.height = '30px';
                    player.style.borderRadius = '50%';
                    cell.appendChild(player);
                }
                boardEl.appendChild(cell);
            }
        }
    }

    handleKeyDown(e) {
        const dirs = {
            ArrowUp: {x: 0, y: -1},
            ArrowDown: {x: 0, y: 1},
            ArrowLeft: {x: -1, y: 0},
            ArrowRight: {x: 1, y: 0}
        };
        if (dirs[e.key]) {
            e.preventDefault();
            this.move(dirs[e.key]);
        }
    }

    move(dir) {
        const newX = this.playerPos.x + dir.x;
        const newY = this.playerPos.y + dir.y;
        if (newY < 0 || newY >= this.board.length || newX < 0 || newX >= this.board[0].length) return;
        if (this.board[newY][newX] === '#') return;
        const originalLevel = this.levels[this.currentLevel];
        if (this.board[newY][newX] === '$') {
            const boxNewX = newX + dir.x;
            const boxNewY = newY + dir.y;
            if (boxNewY < 0 || boxNewY >= this.board.length || boxNewX < 0 || boxNewX >= this.board[0].length) return;
            if (this.board[boxNewY][boxNewX] === '#' || this.board[boxNewY][boxNewX] === '$') return;
            this.board[boxNewY][boxNewX] = '$';
            this.board[newY][newX] = originalLevel[newY][newX] === '.' ? '.' : ' ';
        }
        const origChar = originalLevel[this.playerPos.y][this.playerPos.x];
        this.board[this.playerPos.y][this.playerPos.x] = origChar === '.' ? '.' : ' ';
        this.playerPos = {x: newX, y: newY};
        this.board[newY][newX] = '@';
        this.renderBoard();
        this.checkWin();
    }

    checkWin() {
        for (let y = 0; y < this.levels[this.currentLevel].length; y++) {
            for (let x = 0; x < this.levels[this.currentLevel][y].length; x++) {
                if (this.levels[this.currentLevel][y][x] === '.' && this.board[y][x] !== '$') {
                    return;
                }
            }
        }
        setTimeout(() => {
            alert('恭喜！关卡完成！');
            if (this.currentLevel < this.levels.length - 1) {
                this.nextLevel();
            }
        }, 100);
    }

    prevLevel() {
        if (this.currentLevel > 0) {
            this.currentLevel--;
            this.loadLevel(this.currentLevel);
        }
    }

    nextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        }
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}

class GuessNumberGame {
    constructor() {
        this.targetNumber = 0;
        this.guessCount = 0;
        this.init();
    }

    init() {
        this.startNewGame();
        document.getElementById('guessBtn').addEventListener('click', () => this.makeGuess());
        document.getElementById('guessReset').addEventListener('click', () => this.startNewGame());
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
    }

    startNewGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.guessCount = 0;
        document.getElementById('guessCount').textContent = this.guessCount;
        document.getElementById('guessResult').textContent = '';
        document.getElementById('guessInput').value = '';
    }

    makeGuess() {
        const input = document.getElementById('guessInput');
        const guess = parseInt(input.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            document.getElementById('guessResult').textContent = '请输入1-100之间的数字！';
            document.getElementById('guessResult').style.color = '#e74c3c';
            return;
        }
        this.guessCount++;
        document.getElementById('guessCount').textContent = this.guessCount;
        if (guess === this.targetNumber) {
            document.getElementById('guessResult').textContent = `恭喜！你猜对了！用了 ${this.guessCount} 次！`;
            document.getElementById('guessResult').style.color = '#27ae60';
        } else if (guess < this.targetNumber) {
            document.getElementById('guessResult').textContent = '太小了！再大一点！';
            document.getElementById('guessResult').style.color = '#3498db';
        } else {
            document.getElementById('guessResult').textContent = '太大了！再小一点！';
            document.getElementById('guessResult').style.color = '#e74c3c';
        }
        input.value = '';
    }
}

class MatchThreeGame {
    constructor() {
        this.board = [];
        this.gems = ['💎', '💜', '💛', '💚', '🔮', '⭐'];
        this.score = 0;
        this.selected = null;
        this.init();
    }

    init() {
        this.createBoard();
        this.renderBoard();
        document.getElementById('matchReset').addEventListener('click', () => this.resetGame());
    }

    createBoard() {
        this.board = [];
        for (let y = 0; y < 6; y++) {
            this.board[y] = [];
            for (let x = 0; x < 6; x++) {
                let gem;
                do {
                    gem = this.gems[Math.floor(Math.random() * this.gems.length)];
                } while (this.wouldCreateMatch(x, y, gem));
                this.board[y][x] = gem;
            }
        }
    }

    wouldCreateMatch(x, y, gem) {
        if (x >= 2 && this.board[y][x-1] === gem && this.board[y][x-2] === gem) return true;
        if (y >= 2 && this.board[y-1][x] === gem && this.board[y-2][x] === gem) return true;
        return false;
    }

    renderBoard() {
        const grid = document.getElementById('matchGrid');
        grid.innerHTML = '';
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                const cell = document.createElement('div');
                cell.className = 'match-cell';
                cell.textContent = this.board[y][x];
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.addEventListener('click', () => this.selectCell(x, y));
                grid.appendChild(cell);
            }
        }
    }

    selectCell(x, y) {
        const cells = document.querySelectorAll('.match-cell');
        if (this.selected === null) {
            this.selected = {x, y};
            cells[y * 6 + x].classList.add('selected');
        } else {
            cells[this.selected.y * 6 + this.selected.x].classList.remove('selected');
            if (this.isAdjacent(this.selected.x, this.selected.y, x, y)) {
                this.swapGems(this.selected.x, this.selected.y, x, y);
            }
            this.selected = null;
        }
    }

    isAdjacent(x1, y1, x2, y2) {
        return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
    }

    swapGems(x1, y1, x2, y2) {
        [this.board[y1][x1], this.board[y2][x2]] = [this.board[y2][x2], this.board[y1][x1]];
        const matches = this.findMatches();
        if (matches.length > 0) {
            this.renderBoard();
            setTimeout(() => this.removeMatches(matches), 300);
        } else {
            [this.board[y1][x1], this.board[y2][x2]] = [this.board[y2][x2], this.board[y1][x1]];
            this.renderBoard();
        }
    }

    findMatches() {
        const matches = new Set();
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.board[y][x] === this.board[y][x+1] && this.board[y][x] === this.board[y][x+2]) {
                    matches.add(`${x},${y}`);
                    matches.add(`${x+1},${y}`);
                    matches.add(`${x+2},${y}`);
                }
            }
        }
        for (let x = 0; x < 6; x++) {
            for (let y = 0; y < 4; y++) {
                if (this.board[y][x] === this.board[y+1][x] && this.board[y][x] === this.board[y+2][x]) {
                    matches.add(`${x},${y}`);
                    matches.add(`${x},${y+1}`);
                    matches.add(`${x},${y+2}`);
                }
            }
        }
        return Array.from(matches);
    }

    removeMatches(matches) {
        this.score += matches.length * 10;
        document.getElementById('matchScore').textContent = this.score;
        matches.forEach(pos => {
            const [x, y] = pos.split(',').map(Number);
            this.board[y][x] = null;
        });
        this.dropGems();
        this.fillBoard();
        this.renderBoard();
        const newMatches = this.findMatches();
        if (newMatches.length > 0) {
            setTimeout(() => this.removeMatches(newMatches), 300);
        }
    }

    dropGems() {
        for (let x = 0; x < 6; x++) {
            let emptySpaces = 0;
            for (let y = 5; y >= 0; y--) {
                if (this.board[y][x] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    this.board[y + emptySpaces][x] = this.board[y][x];
                    this.board[y][x] = null;
                }
            }
        }
    }

    fillBoard() {
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 6; x++) {
                if (this.board[y][x] === null) {
                    this.board[y][x] = this.gems[Math.floor(Math.random() * this.gems.length)];
                }
            }
        }
    }

    resetGame() {
        this.score = 0;
        document.getElementById('matchScore').textContent = this.score;
        this.createBoard();
        this.renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameSite();
});
