/**
 * 2048 游戏核心类
 * 实现了经典2048游戏的所有核心功能：
 * - 4x4 网格容器
 * - 滑动合并机制（支持键盘和触摸屏）
 * - 得分计算与持久化
 * - 方块移动动画效果
 */
class Game2048 {
    /**
     * 构造函数：初始化游戏状态和DOM元素
     */
    constructor() {
        this.size = 4;                          // 网格大小（4x4）
        this.board = [];                        // 游戏棋盘数据
        this.score = 0;                         // 当前得分
        this.bestScore = this.loadBestScore();  // 历史最高分（从本地存储加载）
        
        // DOM元素引用
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('bestScore');
        this.newGameButton = document.getElementById('newGame');
        
        this.hasWon = false;                    // 是否已达到2048
        this.tileIdCounter = 0;                 // 方块ID计数器（用于动画追踪）
        this.tilePositions = {};                // 方块位置映射（ID -> {row, col}）
        
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
     * 设置事件监听器：新游戏按钮、键盘事件、触摸屏事件
     */
    setupEventListeners() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.setupTouchControls();
    }

    /**
     * 设置触摸屏滑动控制
     * 通过记录触摸起点和终点，判断滑动方向
     */
    setupTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        // 记录触摸开始位置
        this.gameBoard.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        // 处理触摸结束，判断滑动方向
        this.gameBoard.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // 根据滑动距离判断方向（阈值50px防止误触）
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
        
        // 初始生成两个方块
        this.addRandomTile();
        this.addRandomTile();
        
        this.updateUI();  // 更新界面显示
    }

    /**
     * 创建空棋盘（4x4网格）
     * 每个单元格存储：{value, id, isNew, isMerged}
     * @returns {Array} - 4x4二维数组
     */
    createEmptyBoard() {
        return Array(this.size).fill(null).map(() => 
            Array(this.size).fill({ value: 0, id: null, isNew: false, isMerged: false })
        );
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
            
            // 补充空格子使数组长度为4
            while (newLine.length < this.size) {
                newLine.push({ value: 0, id: null, isNew: false, isMerged: false });
            }
            
            return newLine;
        };

        // 保存移动前的方块位置（用于动画）
        const originalPositions = { ...this.tilePositions };

        // 根据方向处理每一行/列
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

        // 如果有方块移动，更新界面和状态
        if (moved) {
            this.updateTilePositions();           // 更新方块位置映射
            this.addRandomTile();                 // 随机添加新方块
            this.updateUIWithAnimation(originalPositions); // 更新界面（带动画）
            this.checkWin();                      // 检查是否达到2048
            this.checkGameOver();                 // 检查游戏是否结束
        }
    }

    /**
     * 更新方块位置映射表
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
     * 带动画效果更新界面
     * @param {Object} originalPositions - 移动前的方块位置
     */
    updateUIWithAnimation(originalPositions) {
        const tiles = this.gameBoard.querySelectorAll('.tile');
        const newTileIds = new Set();

        // 收集所有当前存在的方块ID
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    newTileIds.add(cell.id);
                }
            }
        }

        // 移除已消失的方块（被合并的）
        tiles.forEach(tile => {
            const tileId = parseInt(tile.dataset.tileId);
            if (!newTileIds.has(tileId)) {
                tile.remove();
            }
        });

        // 更新或创建每个方块的显示
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    // 查找已存在的方块元素
                    let tile = this.gameBoard.querySelector(`[data-tile-id="${cell.id}"]`);
                    
                    // 如果不存在则创建新元素
                    if (!tile) {
                        tile = document.createElement('div');
                        tile.dataset.tileId = cell.id;
                        this.gameBoard.appendChild(tile);
                    }

                    // 设置方块样式类
                    tile.className = `tile tile-${cell.value}`;
                    if (cell.isNew) {
                        tile.classList.add('tile-new');  // 新方块动画
                        cell.isNew = false;
                    }
                    if (cell.isMerged) {
                        tile.classList.add('tile-merged');  // 合并动画
                        cell.isMerged = false;
                    }
                    tile.textContent = cell.value;

                    // 判断方块是否移动（用于决定是否启用动画）
                    const isMoving = originalPositions[cell.id] &&
                        (originalPositions[cell.id].row !== i || originalPositions[cell.id].col !== j);

                    if (!isMoving) {
                        tile.style.transition = 'none';  // 不移动时禁用过渡动画
                    } else {
                        tile.style.transition = 'left 0.15s ease, top 0.15s ease';  // 移动时启用平滑动画
                    }

                    // 计算并设置方块位置
                    const boardWidth = this.gameBoard.clientWidth;
                    const padding = 12;   // 棋盘内边距
                    const gap = 12;       // 方块间距
                    const cellWidth = (boardWidth - 2 * padding - 3 * gap) / 4;
                    
                    tile.style.width = `${cellWidth}px`;
                    tile.style.left = `${j * (cellWidth + gap) + padding}px`;
                    tile.style.top = `${i * (cellWidth + gap) + padding}px`;
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
     * 初始化界面（不带移动动画）
     */
    updateUI() {
        this.gameBoard.innerHTML = '';

        // 创建背景格子（16个）
        for (let i = 0; i < this.size * this.size; i++) {
            const container = document.createElement('div');
            container.className = 'tile-container';
            this.gameBoard.appendChild(container);
        }

        // 创建每个方块元素
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

                    // 计算方块位置
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

        // 更新得分显示
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore(this.bestScore);
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    /**
     * 检查是否达到2048（胜利条件）
     */
    checkWin() {
        if (!this.hasWon) {
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (this.board[i][j].value === 2048) {
                        this.hasWon = true;
                        if (confirm('恭喜！你达到了2048！继续游戏吗？')) {
                            continue;  // 继续游戏（允许超过2048）
                        } else {
                            this.startNewGame();  // 重新开始
                        }
                        return;
                    }
                }
            }
        }
    }

    /**
     * 检查游戏是否结束（无法移动且无空格子）
     */
    checkGameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                // 如果有空格子，游戏未结束
                if (this.board[i][j].value === 0) {
                    return;
                }
                // 如果水平方向有相同数字可合并，游戏未结束
                if (j < this.size - 1 && this.board[i][j].value === this.board[i][j + 1].value) {
                    return;
                }
                // 如果垂直方向有相同数字可合并，游戏未结束
                if (i < this.size - 1 && this.board[i][j].value === this.board[i + 1][j].value) {
                    return;
                }
            }
        }
        // 所有格子已满且无法合并，游戏结束
        alert(`游戏结束！你的得分：${this.score}`);
        this.startNewGame();
    }

    /**
     * 从本地存储加载历史最高分
     * @returns {number} - 历史最高分
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

// DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});