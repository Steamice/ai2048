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

/**
 * 2048 游戏类（站点版本）
 * 在游戏合集中运行的2048游戏实现，支持键盘控制
 */
class Game2048ForSite {
    /**
     * 构造函数：初始化游戏状态和DOM元素
     */
    constructor() {
        this.size = 4;                          // 网格大小（4x4）
        this.board = [];                        // 游戏棋盘数据
        this.score = 0;                         // 当前得分
        this.bestScore = this.loadBestScore();  // 历史最高分（从本地存储加载）
        
        // DOM元素引用
        this.gameBoard = document.getElementById('gameBoard2048');
        this.scoreElement = document.getElementById('score2048');
        this.bestScoreElement = document.getElementById('bestScore2048');
        this.newGameButton = document.getElementById('newGame2048');
        
        this.hasWon = false;                    // 是否已达到2048
        this.tileIdCounter = 0;                 // 方块ID计数器（用于动画追踪）
        this.tilePositions = {};                // 方块位置映射（ID -> {row, col}）
        
        this.keyHandler = (e) => this.handleKeyDown(e); // 键盘事件处理器
        this.init();                            // 初始化游戏
    }

    /**
     * 初始化游戏：设置事件监听器并开始新游戏
     */
    init() {
        this.setupEventListeners();
        this.startNewGame();
    }

    /**
     * 设置事件监听器：新游戏按钮和键盘事件
     */
    setupEventListeners() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        document.addEventListener('keydown', this.keyHandler);
    }

    /**
     * 移除事件监听器（用于关闭游戏时清理）
     */
    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }

    /**
     * 处理键盘方向键事件
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    handleKeyDown(e) {
        const keyMap = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right'
        };
        if (keyMap[e.key]) {
            e.preventDefault();  // 阻止默认行为（如页面滚动）
            this.move(keyMap[e.key]);
        }
    }

    /**
     * 开始新游戏：重置所有状态并初始化棋盘
     */
    startNewGame() {
        this.board = this.createEmptyBoard();
        this.score = 0;
        this.hasWon = false;
        this.tileIdCounter = 0;
        this.tilePositions = {};
        this.addRandomTile();  // 初始生成两个方块
        this.addRandomTile();
        this.updateUI();       // 更新界面显示
    }

    /**
     * 创建空棋盘（4x4网格）
     * @returns {Array} - 4x4二维数组，每个单元格存储{value, id, isNew, isMerged}
     */
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

    /**
     * 在随机空位添加新方块（90%概率为2，10%概率为4）
     */
    addRandomTile() {
        const emptyCells = [];
        
        // 收集所有空格子坐标
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].value === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }

        // 如果有空格子，随机选择一个添加新方块
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.tileIdCounter++;
            
            this.board[randomCell.row][randomCell.col] = {
                value: Math.random() < 0.9 ? 2 : 4,  // 90%概率生成2，10%概率生成4
                id: this.tileIdCounter,
                isNew: true,       // 标记为新方块（用于动画）
                isMerged: false
            };
            
            // 记录方块位置
            this.tilePositions[this.tileIdCounter] = { row: randomCell.row, col: randomCell.col };
        }
    }

    /**
     * 处理方块移动逻辑
     * @param {string} direction - 移动方向：'up', 'down', 'left', 'right'
     */
    move(direction) {
        let moved = false;  // 标记是否有方块移动

        /**
         * 处理单行/列的移动和合并逻辑
         * @param {Array} line - 一行或一列的方块数组
         * @returns {Array} - 处理后的行/列
         */
        const processLine = (line) => {
            // 过滤掉空格子
            let newLine = line.filter(cell => cell.value !== 0);
            
            // 合并相邻相同数字的方块
            for (let i = 0; i < newLine.length - 1; i++) {
                if (newLine[i].value === newLine[i + 1].value) {
                    newLine[i].value *= 2;          // 合并后数值翻倍
                    this.score += newLine[i].value; // 更新得分
                    newLine[i].isMerged = true;    // 标记为合并方块（用于动画）
                    newLine[i + 1].value = 0;      // 被合并的方块置空
                    newLine[i + 1].id = null;
                    moved = true;
                }
            }
            
            // 再次过滤（移除被合并的方块）
            newLine = newLine.filter(cell => cell.value !== 0);
            
            // 填充空格子使长度达到size
            while (newLine.length < this.size) {
                newLine.push({ value: 0, id: null, isNew: false, isMerged: false });
            }
            return newLine;
        };

        // 根据方向处理每一行或列
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

        // 如果有移动发生
        if (moved) {
            this.updateTilePositions();  // 更新方块位置映射
            this.addRandomTile();        // 添加新方块
            this.updateUI();             // 更新界面
            this.checkWin();             // 检查是否获胜
            this.checkGameOver();        // 检查是否游戏结束
        }
    }

    /**
     * 更新方块位置映射
     */
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

    /**
     * 更新游戏界面显示
     */
    updateUI() {
        this.gameBoard.innerHTML = '';
        
        // 创建方块容器
        for (let i = 0; i < this.size * this.size; i++) {
            const container = document.createElement('div');
            container.className = 'tile-container';
            this.gameBoard.appendChild(container);
        }

        // 渲染方块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${cell.value}`;
                    
                    // 添加新方块动画类
                    if (cell.isNew) {
                        tile.classList.add('tile-new');
                        cell.isNew = false;
                    }
                    // 添加合并动画类
                    if (cell.isMerged) {
                        tile.classList.add('tile-merged');
                        cell.isMerged = false;
                    }
                    
                    tile.textContent = cell.value;
                    tile.dataset.tileId = cell.id;
                    
                    // 计算方块位置和大小
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

        // 更新得分显示
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore(this.bestScore);
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    /**
     * 检查是否达到2048（获胜条件）
     */
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

    /**
     * 检查是否游戏结束（无法继续移动）
     */
    checkGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                // 如果有空格子，游戏未结束
                if (this.board[i][j].value === 0) return;
                // 如果右边有相同数字，游戏未结束
                if (j < this.size - 1 && this.board[i][j].value === this.board[i][j + 1].value) return;
                // 如果下边有相同数字，游戏未结束
                if (i < this.size - 1 && this.board[i][j].value === this.board[i + 1][j].value) return;
            }
        }
        alert(`游戏结束！你的得分：${this.score}`);
        this.startNewGame();
    }

    /**
     * 从本地存储加载最高分
     * @returns {number} - 最高分
     */
    loadBestScore() {
        const saved = localStorage.getItem('2048-best-score');
        return saved ? parseInt(saved, 10) : 0;
    }

    /**
     * 保存最高分到本地存储
     * @param {number} score - 要保存的分数
     */
    saveBestScore(score) {
        localStorage.setItem('2048-best-score', score.toString());
    }
}

/**
 * 贪吃蛇游戏类
 * 使用Canvas绘制，支持键盘方向键控制蛇的移动方向
 */
class SnakeGame {
    /**
     * 构造函数：初始化游戏状态和Canvas上下文
     */
    constructor() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;        // 每个格子的大小（像素）
        this.score = 0;            // 当前得分
        this.snake = [{x: 10, y: 10}]; // 蛇的身体（由多个段组成）
        this.direction = {x: 1, y: 0}; // 移动方向（初始向右）
        this.food = this.generateFood(); // 食物位置
        this.gameRunning = false;  // 游戏是否正在运行
        this.gameLoop = null;      // 游戏循环定时器
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    /**
     * 初始化方法：设置事件监听器并绘制初始画面
     */
    init() {
        document.getElementById('snakeStart').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.keyHandler);
        this.draw();
    }

    /**
     * 处理键盘方向键事件
     * 防止蛇反向移动（例如：向右时不能立即向左）
     * @param {KeyboardEvent} e - 键盘事件对象
     */
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
            // 如果蛇长度大于1，防止反向移动
            if (this.snake.length > 1) {
                if (newDir.x !== -this.direction.x || newDir.y !== -this.direction.y) {
                    this.direction = newDir;
                }
            } else {
                this.direction = newDir;
            }
        }
    }

    /**
     * 开始新游戏
     */
    startGame() {
        if (this.gameRunning) return;
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.score = 0;
        this.food = this.generateFood();
        this.gameRunning = true;
        document.getElementById('snakeScore').textContent = this.score;
        this.gameLoop = setInterval(() => this.update(), 100); // 每100ms更新一次
    }

    /**
     * 在随机位置生成食物（确保不在蛇身上）
     * @returns {Object} - 食物位置{x, y}
     */
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

    /**
     * 更新游戏状态
     * 移动蛇、检测碰撞、检测食物
     */
    update() {
        // 计算新的头部位置
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // 检测边界碰撞
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
            this.gameOver();
            return;
        }
        
        // 检测自身碰撞
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        // 添加新头部
        this.snake.unshift(head);
        
        // 检测是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snakeScore').textContent = this.score;
            this.food = this.generateFood(); // 生成新食物
        } else {
            this.snake.pop(); // 移除尾部（移动效果）
        }
        
        this.draw(); // 重新绘制画面
    }

    /**
     * 绘制游戏画面
     */
    draw() {
        // 清空画布（黑色背景）
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制蛇（绿色）
        this.ctx.fillStyle = '#27ae60';
        for (let segment of this.snake) {
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        }
        
        // 绘制食物（红色）
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }

    /**
     * 游戏结束处理
     */
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        setTimeout(() => {
            alert(`游戏结束！得分：${this.score}`);
        }, 50);
    }

    /**
     * 移除事件监听器
     */
    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}

/**
 * 俄罗斯方块游戏类
 * 使用Canvas绘制，支持键盘控制方块移动和旋转
 */
class TetrisGame {
    /**
     * 构造函数：初始化游戏状态和Canvas上下文
     */
    constructor() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 30;   // 每个格子的大小（像素）
        this.cols = 10;       // 列数
        this.rows = 20;       // 行数
        this.board = [];      // 游戏面板
        this.score = 0;       // 当前得分
        this.level = 1;       // 当前等级
        
        // 七种标准俄罗斯方块形状（I、O、T、L、J、Z、S）
        this.pieces = [
            [[1,1,1,1]],                        // I形
            [[1,1],[1,1]],                      // O形
            [[1,1,1],[0,1,0]],                  // T形
            [[1,1,1],[1,0,0]],                  // L形
            [[1,1,1],[0,0,1]],                  // J形
            [[1,1,0],[0,1,1]],                  // Z形
            [[0,1,1],[1,1,0]]                   // S形
        ];
        
        // 对应七种方块的颜色
        this.colors = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];
        
        this.currentPiece = null;    // 当前方块
        this.currentPos = {x: 0, y: 0}; // 当前方块位置
        this.currentColor = '';      // 当前方块颜色
        this.gameRunning = false;    // 游戏是否正在运行
        this.gameLoop = null;        // 游戏循环定时器
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    /**
     * 初始化方法：设置事件监听器
     */
    init() {
        document.getElementById('tetrisStart').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.keyHandler);
    }

    /**
     * 处理键盘事件
     * ← → 移动方块，↑ 旋转方块，↓ 加速下落
     * @param {KeyboardEvent} e - 键盘事件对象
     */
    handleKeyDown(e) {
        if (!this.gameRunning) return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.movePiece(-1, 0);  // 左移
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.movePiece(1, 0);   // 右移
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.movePiece(0, 1);   // 下移
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.rotatePiece();     // 旋转
        }
    }

    /**
     * 开始新游戏
     */
    startGame() {
        // 初始化空白面板
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(null));
        this.score = 0;
        this.level = 1;
        this.gameRunning = true;
        document.getElementById('tetrisScore').textContent = this.score;
        document.getElementById('tetrisLevel').textContent = this.level;
        this.spawnPiece();
        // 等级越高，下落速度越快（最低100ms）
        this.gameLoop = setInterval(() => this.update(), Math.max(100, 500 - (this.level - 1) * 50));
    }

    /**
     * 在顶部生成新方块
     */
    spawnPiece() {
        const index = Math.floor(Math.random() * this.pieces.length);
        this.currentPiece = this.pieces[index].map(row => [...row]);
        this.currentColor = this.colors[index];
        // 将方块放置在顶部中央
        this.currentPos = {x: Math.floor(this.cols / 2) - Math.floor(this.currentPiece[0].length / 2), y: 0};
        
        // 如果刚生成就碰撞，游戏结束
        if (this.checkCollision()) {
            this.gameOver();
        }
        this.draw();
    }

    /**
     * 移动方块
     * @param {number} dx - x方向移动量
     * @param {number} dy - y方向移动量
     */
    movePiece(dx, dy) {
        this.currentPos.x += dx;
        this.currentPos.y += dy;
        
        // 检测碰撞
        if (this.checkCollision()) {
            this.currentPos.x -= dx;
            this.currentPos.y -= dy;
            // 如果是向下移动时碰撞，锁定方块
            if (dy > 0) {
                this.lockPiece();
            }
        }
        this.draw();
    }

    /**
     * 旋转方块（顺时针90度）
     */
    rotatePiece() {
        if (!this.currentPiece) return;
        const oldPiece = this.currentPiece.map(row => [...row]);
        
        // 矩阵转置并反转每行实现顺时针旋转
        this.currentPiece = this.currentPiece[0].map((_, i) =>
            this.currentPiece.map(row => row[i]).reverse()
        );
        
        // 如果旋转后碰撞，恢复原来的形状
        if (this.checkCollision()) {
            this.currentPiece = oldPiece;
        }
        this.draw();
    }

    /**
     * 检测方块是否与边界或已固定方块碰撞
     * @returns {boolean} - 是否发生碰撞
     */
    checkCollision() {
        if (!this.currentPiece) return false;
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    const newX = this.currentPos.x + x;
                    const newY = this.currentPos.y + y;
                    // 检测边界碰撞
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) return true;
                    // 检测与已固定方块碰撞
                    if (newY >= 0 && this.board[newY][newX]) return true;
                }
            }
        }
        return false;
    }

    /**
     * 将当前方块固定到面板上
     */
    lockPiece() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    this.board[this.currentPos.y + y][this.currentPos.x + x] = this.currentColor;
                }
            }
        }
        this.clearLines();  // 清除完整行
        this.spawnPiece();  // 生成新方块
    }

    /**
     * 清除完整的行并更新得分和等级
     */
    clearLines() {
        let linesCleared = 0;
        // 从底部向上检查每一行
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== null)) {
                this.board.splice(y, 1);           // 删除该行
                this.board.unshift(Array(this.cols).fill(null)); // 在顶部添加空行
                linesCleared++;
                y++; // 重新检查当前行（因为上面的行已经下移）
            }
        }
        
        if (linesCleared > 0) {
            // 得分 = 消除行数 × 100 × 消除行数（连消加分）
            this.score += linesCleared * 100 * linesCleared;
            this.level = Math.floor(this.score / 500) + 1;
            document.getElementById('tetrisScore').textContent = this.score;
            document.getElementById('tetrisLevel').textContent = this.level;
            // 更新游戏速度
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), Math.max(100, 500 - (this.level - 1) * 50));
        }
    }

    /**
     * 游戏主循环：方块自动下落
     */
    update() {
        this.movePiece(0, 1);
    }

    /**
     * 绘制游戏画面
     */
    draw() {
        // 清空画布（黑色背景）
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制已固定的方块
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize - 1, this.gridSize - 1);
                }
            }
        }
        
        // 绘制当前方块
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

    /**
     * 游戏结束处理
     */
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        alert(`游戏结束！得分：${this.score}`);
    }

    /**
     * 移除事件监听器
     */
    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}

/**
 * 打砖块游戏类
 * 使用Canvas绘制，支持键盘方向键控制挡板移动
 */
class BreakoutGame {
    /**
     * 构造函数：初始化游戏状态和Canvas上下文
     */
    constructor() {
        this.canvas = document.getElementById('breakoutCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 挡板属性
        this.paddle = {x: 175, y: 470, width: 60, height: 10, speed: 5};
        
        // 小球属性
        this.ball = {x: 200, y: 450, dx: 3, dy: -3, radius: 8};
        
        this.bricks = [];      // 砖块数组
        this.score = 0;        // 当前得分
        this.gameRunning = false; // 游戏是否正在运行
        this.keys = {};        // 键盘状态追踪
        
        this.keyDownHandler = (e) => { this.keys[e.key] = true; };
        this.keyUpHandler = (e) => { this.keys[e.key] = false; };
        this.init();
    }

    /**
     * 初始化方法：设置事件监听器
     */
    init() {
        document.getElementById('breakoutStart').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
    }

    /**
     * 开始新游戏
     */
    startGame() {
        // 创建砖块（5行8列）
        this.bricks = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                this.bricks.push({x: col * 50 + 5, y: row * 25 + 30, width: 45, height: 20, alive: true});
            }
        }
        
        // 重置挡板和小球位置
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

    /**
     * 游戏主循环（使用requestAnimationFrame实现流畅动画）
     */
    gameLoop() {
        if (!this.gameRunning) return;
        
        // 移动挡板
        if (this.keys['ArrowLeft'] && this.paddle.x > 0) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys['ArrowRight'] && this.paddle.x < this.canvas.width - this.paddle.width) {
            this.paddle.x += this.paddle.speed;
        }
        
        // 移动小球
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // 检测边界碰撞（左右）
        if (this.ball.x <= 0 || this.ball.x >= this.canvas.width) {
            this.ball.dx = -this.ball.dx;
        }
        
        // 检测边界碰撞（顶部）
        if (this.ball.y <= 0) {
            this.ball.dy = -this.ball.dy;
        }
        
        // 检测边界碰撞（底部 - 游戏结束）
        if (this.ball.y >= this.canvas.height) {
            this.gameOver();
            return;
        }
        
        // 检测挡板碰撞
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            this.ball.dy = -Math.abs(this.ball.dy);
            // 根据击中挡板的位置调整水平速度
            this.ball.dx += (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / 20;
        }
        
        // 检测砖块碰撞
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
        
        // 检测是否全部清除（胜利条件）
        if (this.bricks.every(b => !b.alive)) {
            this.gameWin();
            return;
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * 绘制游戏画面
     */
    draw() {
        // 清空画布（黑色背景）
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制挡板（蓝色）
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // 绘制小球（红色）
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制砖块（每行不同颜色）
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];
        for (let i = 0; i < this.bricks.length; i++) {
            const brick = this.bricks[i];
            if (brick.alive) {
                this.ctx.fillStyle = colors[Math.floor(i / 8) % colors.length];
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        }
    }

    /**
     * 游戏结束处理
     */
    gameOver() {
        this.gameRunning = false;
        alert(`游戏结束！得分：${this.score}`);
    }

    /**
     * 游戏胜利处理
     */
    gameWin() {
        this.gameRunning = false;
        alert(`恭喜！你赢了！得分：${this.score}`);
    }

    /**
     * 移除事件监听器
     */
    removeEventListeners() {
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
    }
}

/**
 * 井字棋游戏类（双人对战）
 * 使用DOM元素渲染棋盘，支持鼠标点击落子
 */
class TicTacToeGame {
    /**
     * 构造函数：初始化游戏状态
     */
    constructor() {
        this.board = Array(9).fill(null); // 3x3棋盘（用数组表示）
        this.currentPlayer = 'X';         // 当前玩家（X先）
        this.gameOver = false;            // 游戏是否结束
        this.init();
    }

    /**
     * 初始化方法：渲染棋盘并设置事件监听器
     */
    init() {
        this.renderBoard();
        document.getElementById('tttReset').addEventListener('click', () => this.resetGame());
    }

    /**
     * 渲染棋盘到DOM
     */
    renderBoard() {
        const boardEl = document.getElementById('tttBoard');
        boardEl.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'ttt-cell';
            
            // 如果该位置有棋子，显示并添加对应样式
            if (this.board[i]) {
                cell.classList.add(this.board[i].toLowerCase());
                cell.textContent = this.board[i];
            }
            
            cell.addEventListener('click', () => this.makeMove(i));
            boardEl.appendChild(cell);
        }
    }

    /**
     * 玩家落子
     * @param {number} index - 落子位置（0-8）
     */
    makeMove(index) {
        // 如果位置已被占用或游戏已结束，不处理
        if (this.board[index] || this.gameOver) return;
        
        // 落子
        this.board[index] = this.currentPlayer;
        this.renderBoard();
        
        // 检查是否获胜
        if (this.checkWin()) {
            alert(`玩家 ${this.currentPlayer} 获胜！`);
            this.gameOver = true;
            return;
        }
        
        // 检查是否平局
        if (this.board.every(cell => cell)) {
            alert('平局！');
            this.gameOver = true;
            return;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('tttPlayer').textContent = this.currentPlayer;
    }

    /**
     * 检查是否有玩家获胜
     * @returns {boolean} - 是否获胜
     */
    checkWin() {
        // 所有可能的获胜组合（3行、3列、2条对角线）
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // 行
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // 列
            [0, 4, 8], [2, 4, 6]              // 对角线
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

    /**
     * 重置游戏
     */
    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        document.getElementById('tttPlayer').textContent = this.currentPlayer;
        this.renderBoard();
    }
}

/**
 * 记忆翻牌游戏类
 * 玩家需要找出所有配对的卡片
 */
class MemoryGame {
    /**
     * 构造函数：初始化游戏状态
     */
    constructor() {
        this.cards = [];       // 卡片数组（包含配对的符号）
        this.flipped = [];     // 当前翻开的卡片索引
        this.matched = [];     // 已配对的卡片索引
        this.moves = 0;        // 移动次数
        this.symbols = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🍍']; // 卡片符号
        this.init();
    }

    /**
     * 初始化方法：洗牌并渲染卡片
     */
    init() {
        this.shuffleCards();
        this.renderCards();
        document.getElementById('memoryReset').addEventListener('click', () => this.resetGame());
    }

    /**
     * 洗牌（Fisher-Yates算法）
     */
    shuffleCards() {
        // 创建配对的卡片数组（每个符号出现两次）
        this.cards = [...this.symbols, ...this.symbols];
        
        // Fisher-Yates洗牌算法
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        document.getElementById('memoryMoves').textContent = this.moves;
    }

    /**
     * 渲染卡片到DOM
     */
    renderCards() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        
        for (let i = 0; i < this.cards.length; i++) {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = i;
            card.textContent = '?'; // 默认显示问号
            card.addEventListener('click', () => this.flipCard(i));
            grid.appendChild(card);
        }
    }

    /**
     * 翻转卡片
     * @param {number} index - 要翻转的卡片索引
     */
    flipCard(index) {
        // 防止重复翻转：已有两张翻开、已翻开、已配对
        if (this.flipped.length >= 2 || this.flipped.includes(index) || this.matched.includes(index)) return;
        
        const cards = document.querySelectorAll('.memory-card');
        cards[index].classList.add('flipped');
        cards[index].textContent = this.cards[index];
        this.flipped.push(index);
        
        // 如果翻开了两张卡片
        if (this.flipped.length === 2) {
            this.moves++;
            document.getElementById('memoryMoves').textContent = this.moves;
            
            // 检查是否匹配
            if (this.cards[this.flipped[0]] === this.cards[this.flipped[1]]) {
                // 匹配成功
                this.matched.push(...this.flipped);
                cards[this.flipped[0]].classList.add('matched');
                cards[this.flipped[1]].classList.add('matched');
                this.flipped = [];
                
                // 检查是否全部配对完成
                if (this.matched.length === this.cards.length) {
                    setTimeout(() => alert(`恭喜！你用了 ${this.moves} 步完成！`), 300);
                }
            } else {
                // 匹配失败，延迟翻回去
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

    /**
     * 重置游戏
     */
    resetGame() {
        this.shuffleCards();
        this.renderCards();
    }
}

/**
 * 打地鼠游戏类
 * 在限定时间内点击出现的地鼠获得分数（30秒内尽可能多地击中地鼠）
 */
class WhackAMoleGame {
    /**
     * 构造函数：初始化游戏状态
     */
    constructor() {
        this.score = 0;         // 当前得分
        this.timeLeft = 30;     // 剩余时间（秒）
        this.gameRunning = false; // 游戏是否正在运行
        this.timer = null;      // 倒计时定时器
        this.moleTimer = null;  // 地鼠出现定时器
        this.init();
    }

    /**
     * 初始化方法：渲染游戏网格并设置事件监听器
     */
    init() {
        this.renderGrid();
        document.getElementById('whackStart').addEventListener('click', () => this.startGame());
    }

    /**
     * 渲染3x3的游戏网格
     */
    renderGrid() {
        const grid = document.getElementById('whackGrid');
        grid.innerHTML = '';
        
        // 创建9个洞（3x3网格）
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'whack-hole';
            
            const mole = document.createElement('div');
            mole.className = 'whack-mole';
            mole.textContent = '🦔'; // 地鼠表情
            mole.addEventListener('click', () => this.whackMole(i));
            
            hole.appendChild(mole);
            grid.appendChild(hole);
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        if (this.gameRunning) return;
        
        this.score = 0;
        this.timeLeft = 30;
        this.gameRunning = true;
        document.getElementById('whackScore').textContent = this.score;
        document.getElementById('whackTime').textContent = this.timeLeft;
        
        // 启动倒计时（每秒更新）
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('whackTime').textContent = this.timeLeft;
            if (this.timeLeft <= 0) this.gameOver();
        }, 1000);
        
        // 开始显示地鼠
        this.showMole();
    }

    /**
     * 随机显示地鼠
     */
    showMole() {
        if (!this.gameRunning) return;
        
        // 隐藏所有地鼠
        const moles = document.querySelectorAll('.whack-mole');
        moles.forEach(m => m.classList.remove('active'));
        
        // 随机选择一个洞显示地鼠
        const randomIndex = Math.floor(Math.random() * 9);
        moles[randomIndex].classList.add('active');
        
        // 地鼠显示一段时间后消失（600ms-1000ms随机），然后显示下一只
        this.moleTimer = setTimeout(() => this.showMole(), 600 + Math.random() * 400);
    }

    /**
     * 敲击地鼠
     * @param {number} index - 被点击的地鼠索引
     */
    whackMole(index) {
        if (!this.gameRunning) return;
        
        const moles = document.querySelectorAll('.whack-mole');
        // 如果地鼠是活跃状态（显示中）
        if (moles[index].classList.contains('active')) {
            this.score += 10;  // 击中得10分
            document.getElementById('whackScore').textContent = this.score;
            moles[index].classList.remove('active'); // 隐藏地鼠
        }
    }

    /**
     * 游戏结束处理
     */
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.timer);
        clearTimeout(this.moleTimer);
        
        // 隐藏所有地鼠
        document.querySelectorAll('.whack-mole').forEach(m => m.classList.remove('active'));
        
        alert(`游戏结束！得分：${this.score}`);
    }
}

/**
 * 推箱子游戏类（Sokoban）
 * 玩家需要使用方向键控制角色将所有箱子推到目标位置
 * 地图符号说明：
 * - # : 墙壁
 * - . : 目标位置
 * - $ : 箱子
 * - @ : 玩家
 * - 空格 : 空地
 */
class SokobanGame {
    /**
     * 构造函数：初始化游戏状态和关卡数据
     */
    constructor() {
        // 关卡数据（3个难度递增的关卡）
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
        
        this.currentLevel = 0;     // 当前关卡索引
        this.board = [];           // 当前游戏面板状态
        this.playerPos = {x: 0, y: 0}; // 玩家位置
        this.keyHandler = (e) => this.handleKeyDown(e);
        this.init();
    }

    /**
     * 初始化方法：加载初始关卡并设置事件监听器
     */
    init() {
        this.loadLevel(this.currentLevel);
        document.getElementById('sokobanReset').addEventListener('click', () => this.loadLevel(this.currentLevel));
        document.getElementById('sokobanPrev').addEventListener('click', () => this.prevLevel());
        document.getElementById('sokobanNext').addEventListener('click', () => this.nextLevel());
        document.addEventListener('keydown', this.keyHandler);
    }

    /**
     * 加载指定关卡
     * @param {number} levelIndex - 关卡索引
     */
    loadLevel(levelIndex) {
        const level = this.levels[levelIndex];
        // 将关卡字符串转换为二维数组
        this.board = level.map(row => row.split(''));
        
        // 查找玩家初始位置
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

    /**
     * 渲染游戏面板到DOM
     */
    renderBoard() {
        const boardEl = document.getElementById('sokobanBoard');
        boardEl.innerHTML = '';
        boardEl.style.gridTemplateColumns = `repeat(${this.board[0].length}, 40px)`;
        
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'sokoban-cell';
                
                const char = this.levels[this.currentLevel][y][x];    // 原始关卡字符
                const currentChar = this.board[y][x];                   // 当前状态字符
                
                // 根据字符类型设置单元格样式
                if (char === '#' || currentChar === '#') {
                    cell.classList.add('sokoban-wall');
                } else {
                    cell.classList.add(char === '.' ? 'sokoban-target' : 'sokoban-floor');
                }
                
                // 添加箱子或玩家元素
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

    /**
     * 处理键盘事件（方向键控制）
     * @param {KeyboardEvent} e - 键盘事件对象
     */
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

    /**
     * 移动玩家
     * @param {Object} dir - 移动方向 {x, y}
     */
    move(dir) {
        const newX = this.playerPos.x + dir.x;
        const newY = this.playerPos.y + dir.y;
        
        // 边界检查
        if (newY < 0 || newY >= this.board.length || newX < 0 || newX >= this.board[0].length) return;
        
        // 墙壁检查
        if (this.board[newY][newX] === '#') return;
        
        const originalLevel = this.levels[this.currentLevel];
        
        // 如果目标位置是箱子
        if (this.board[newY][newX] === '$') {
            const boxNewX = newX + dir.x;
            const boxNewY = newY + dir.y;
            
            // 箱子移动的边界检查
            if (boxNewY < 0 || boxNewY >= this.board.length || boxNewX < 0 || boxNewX >= this.board[0].length) return;
            
            // 箱子移动的障碍物检查（墙壁或其他箱子）
            if (this.board[boxNewY][boxNewX] === '#' || this.board[boxNewY][boxNewX] === '$') return;
            
            // 移动箱子
            this.board[boxNewY][boxNewX] = '$';
            this.board[newY][newX] = originalLevel[newY][newX] === '.' ? '.' : ' ';
        }
        
        // 保存玩家原位置的原始字符
        const origChar = originalLevel[this.playerPos.y][this.playerPos.x];
        this.board[this.playerPos.y][this.playerPos.x] = origChar === '.' ? '.' : ' ';
        
        // 更新玩家位置
        this.playerPos = {x: newX, y: newY};
        this.board[newY][newX] = '@';
        
        this.renderBoard();
        this.checkWin();
    }

    /**
     * 检查是否完成当前关卡（所有箱子都在目标位置上）
     */
    checkWin() {
        for (let y = 0; y < this.levels[this.currentLevel].length; y++) {
            for (let x = 0; x < this.levels[this.currentLevel][y].length; x++) {
                // 如果有目标位置没有箱子，则未完成
                if (this.levels[this.currentLevel][y][x] === '.' && this.board[y][x] !== '$') {
                    return;
                }
            }
        }
        
        // 完成关卡
        setTimeout(() => {
            alert('恭喜！关卡完成！');
            if (this.currentLevel < this.levels.length - 1) {
                this.nextLevel();
            }
        }, 100);
    }

    /**
     * 上一关
     */
    prevLevel() {
        if (this.currentLevel > 0) {
            this.currentLevel--;
            this.loadLevel(this.currentLevel);
        }
    }

    /**
     * 下一关
     */
    nextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
        }
    }

    /**
     * 移除事件监听器
     */
    removeEventListeners() {
        document.removeEventListener('keydown', this.keyHandler);
    }
}

/**
 * 猜数字游戏类
 * 玩家需要在1-100之间猜一个随机生成的数字，系统会提示太大或太小
 */
class GuessNumberGame {
    /**
     * 构造函数：初始化游戏状态
     */
    constructor() {
        this.targetNumber = 0;  // 目标数字
        this.guessCount = 0;    // 猜测次数
        this.init();
    }

    /**
     * 初始化方法：开始新游戏并设置事件监听器
     */
    init() {
        this.startNewGame();
        document.getElementById('guessBtn').addEventListener('click', () => this.makeGuess());
        document.getElementById('guessReset').addEventListener('click', () => this.startNewGame());
        
        // 回车键提交猜测
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.makeGuess();
        });
    }

    /**
     * 开始新游戏（生成随机目标数字）
     */
    startNewGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1; // 生成1-100的随机数
        this.guessCount = 0;
        document.getElementById('guessCount').textContent = this.guessCount;
        document.getElementById('guessResult').textContent = '';
        document.getElementById('guessInput').value = '';
    }

    /**
     * 处理玩家猜测
     */
    makeGuess() {
        const input = document.getElementById('guessInput');
        const guess = parseInt(input.value);
        
        // 输入验证
        if (isNaN(guess) || guess < 1 || guess > 100) {
            document.getElementById('guessResult').textContent = '请输入1-100之间的数字！';
            document.getElementById('guessResult').style.color = '#e74c3c'; // 红色提示错误
            return;
        }
        
        // 更新猜测次数
        this.guessCount++;
        document.getElementById('guessCount').textContent = this.guessCount;
        
        // 判断猜测结果
        if (guess === this.targetNumber) {
            document.getElementById('guessResult').textContent = `恭喜！你猜对了！用了 ${this.guessCount} 次！`;
            document.getElementById('guessResult').style.color = '#27ae60'; // 绿色表示成功
        } else if (guess < this.targetNumber) {
            document.getElementById('guessResult').textContent = '太小了！再大一点！';
            document.getElementById('guessResult').style.color = '#3498db'; // 蓝色提示
        } else {
            document.getElementById('guessResult').textContent = '太大了！再小一点！';
            document.getElementById('guessResult').style.color = '#e74c3c'; // 红色提示
        }
        
        // 清空输入框
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
