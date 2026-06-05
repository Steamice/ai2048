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
     * @param {Object} [options] - 可选配置
     * @param {string} [options.boardId='gameBoard'] - 棋盘容器元素ID
     * @param {string} [options.scoreId='score'] - 当前得分元素ID
     * @param {string} [options.bestScoreId='bestScore'] - 最高分元素ID
     * @param {string} [options.newGameBtnId='newGame'] - 新游戏按钮ID
     */
    constructor(options = {}) {
        // ===== 常量定义（便于维护与调整）=====
        this.SIZE = 4;                          // 网格大小（4x4）
        this.PADDING = 12;                      // 棋盘内边距（像素）
        this.GAP = 12;                          // 方块间距（像素）
        this.SWIPE_THRESHOLD = 50;              // 触摸滑动判定阈值
        this.NEW_TILE_4_PROBABILITY = 0.1;      // 生成数字4的概率（其余为2）
        this.STORAGE_KEY_BEST = '2048-best-score'; // localStorage键名
        this.WIN_VALUE = 2048;                  // 胜利目标值

        // ===== DOM元素ID配置（支持子类覆盖）=====
        this.boardId = options.boardId || 'gameBoard';
        this.scoreId = options.scoreId || 'score';
        this.bestScoreId = options.bestScoreId || 'bestScore';
        this.newGameBtnId = options.newGameBtnId || 'newGame';

        // ===== 游戏状态 =====
        this.board = [];                        // 游戏棋盘数据
        this.score = 0;                         // 当前得分
        this.bestScore = this.loadBestScore();  // 历史最高分（从本地存储加载）
        this.hasWon = false;                    // 是否已达到胜利条件
        this.tileIdCounter = 0;                 // 方块ID计数器（用于动画追踪）
        this.tilePositions = {};                // 方块位置映射（ID -> {row, col}）

        // ===== DOM元素引用 =====
        this.gameBoard = document.getElementById(this.boardId);
        this.scoreElement = document.getElementById(this.scoreId);
        this.bestScoreElement = document.getElementById(this.bestScoreId);
        this.newGameButton = document.getElementById(this.newGameBtnId);

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
     * 子类可通过设置 this.enableTouch = false 关闭触摸支持
     */
    setupEventListeners() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        if (this.enableTouch !== false) {
            this.setupTouchControls();
        }
    }

    /**
     * 设置触摸屏滑动控制
     * 通过记录触摸起点和终点，判断滑动方向
     * 该方法在构造函数中调用，初始化触摸屏滑动控制。
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
                if (diffX > this.SWIPE_THRESHOLD) this.move('right');
                else if (diffX < -this.SWIPE_THRESHOLD) this.move('left');
            } else {
                if (diffY > this.SWIPE_THRESHOLD) this.move('down');
                else if (diffY < -this.SWIPE_THRESHOLD) this.move('up');
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
     * @returns {Array<Array<Object>>} - 4x4二维数组
     */
    createEmptyBoard() {
        const board = [];
        for (let i = 0; i < this.SIZE; i++) {
            board[i] = [];
            for (let j = 0; j < this.SIZE; j++) {
                board[i][j] = { value: 0, id: null, isNew: false, isMerged: false };
            }
        }
        return board;
    }

    /**
     * 创建空格子对象（用于processLine补充空位）
     * @returns {Object} 空白格对象
     */
    createEmptyCell() {
        return { value: 0, id: null, isNew: false, isMerged: false };
    }

    /**
     * 在随机空位添加新方块（90%概率为2，10%概率为4）
     */
    addRandomTile() {
        const emptyCells = [];

        // 收集所有空格子坐标
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
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
                value: Math.random() < this.NEW_TILE_4_PROBABILITY ? 4 : 2, // 概率生成4或2
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
     * @returns {void}
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
                    newLine[i].isMerged = true;     // 标记为合并方块（用于动画）
                    newLine[i + 1].value = 0;       // 被合并的方块置空
                    newLine[i + 1].id = null;
                    moved = true;
                }
            }

            // 再次过滤（移除被合并的方块）
            newLine = newLine.filter(cell => cell.value !== 0);

            // 补充空格子使数组长度为 SIZE
            while (newLine.length < this.SIZE) {
                newLine.push(this.createEmptyCell());
            }

            return newLine;
        };

        /**
         * 比较两行/列是否相同（仅比较 value，避免 JSON.stringify 性能开销）
         * @param {Array} a - 数组A
         * @param {Array} b - 数组B
         * @returns {boolean} 是否相同
         */
        const isSameValues = (a, b) => {
            for (let i = 0; i < a.length; i++) {
                if (a[i].value !== b[i].value) return false;
            }
            return true;
        };

        // 保存移动前的方块位置（用于动画）
        const originalPositions = { ...this.tilePositions };

        // 处理四个方向：使用统一的迭代器函数消除重复代码
        const lineHandlers = {
            left: (i) => {
                const original = [...this.board[i]];
                this.board[i] = processLine([...this.board[i]]);
                if (!moved) moved = !isSameValues(original, this.board[i]);
            },
            right: (i) => {
                const original = [...this.board[i]];
                this.board[i] = processLine([...this.board[i]].reverse()).reverse();
                if (!moved) moved = !isSameValues(original, this.board[i]);
            },
            up: (j) => {
                const column = this.getColumn(j);
                const original = [...column];
                const newColumn = processLine([...column]);
                this.setColumn(j, newColumn);
                if (!moved) moved = !isSameValues(original, newColumn);
            },
            down: (j) => {
                const column = this.getColumn(j);
                const original = [...column];
                const newColumn = processLine([...column].reverse()).reverse();
                this.setColumn(j, newColumn);
                if (!moved) moved = !isSameValues(original, newColumn);
            }
        };

        // 根据方向遍历行或列
        if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < this.SIZE; i++) lineHandlers[direction](i);
        } else if (direction === 'up' || direction === 'down') {
            for (let j = 0; j < this.SIZE; j++) lineHandlers[direction](j);
        }

        // 如果有方块移动，更新界面和状态
        if (moved) {
            this.updateTilePositions();           // 更新方块位置映射
            this.addRandomTile();                 // 随机添加新方块
            this.updateUIWithAnimation(originalPositions); // 更新界面（带动画）
            this.checkWin();                      // 检查是否达到胜利条件
            this.checkGameOver();                 // 检查游戏是否结束
        }
    }

    /**
     * 获取指定列的方块数组（不影响原数据）
     * @param {number} colIndex - 列索引
     * @returns {Array<Object>} 该列的方块数组副本
     */
    getColumn(colIndex) {
        const column = [];
        for (let i = 0; i < this.SIZE; i++) {
            column.push(this.board[i][colIndex]);
        }
        return column;
    }

    /**
     * 设置指定列的方块数组
     * @param {number} colIndex - 列索引
     * @param {Array<Object>} column - 新的列数据
     */
    setColumn(colIndex, column) {
        for (let i = 0; i < this.SIZE; i++) {
            this.board[i][colIndex] = column[i];
        }
    }

    /**
     * 更新方块位置映射表
     */
    updateTilePositions() {
        this.tilePositions = {};
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                if (this.board[i][j].id !== null) {
                    this.tilePositions[this.board[i][j].id] = { row: i, col: j };
                }
            }
        }
    }

    /**
     * 计算棋盘上每个方块的位置和尺寸信息
     * @returns {{cellWidth: number}} 包含cellWidth的对象
     */
    getTileMetrics() {
        const boardWidth = this.gameBoard.clientWidth;
        const cellWidth = (boardWidth - 2 * this.PADDING - (this.SIZE - 1) * this.GAP) / this.SIZE;
        return { cellWidth };
    }

    /**
     * 根据行列索引计算方块的位置坐标
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     * @param {number} cellWidth - 方块宽度
     * @returns {{left: number, top: number}} 位置对象
     */
    getTilePosition(row, col, cellWidth) {
        return {
            left: col * (cellWidth + this.GAP) + this.PADDING,
            top: row * (cellWidth + this.GAP) + this.PADDING
        };
    }

    /**
     * 创建或更新一个方块DOM元素
     * @param {Object} cell - 棋盘单元格数据
     * @param {Object} originalPos - 移动前位置
     * @param {number} cellWidth - 方块宽度
     * @returns {HTMLElement} 方块DOM元素
     */
    createOrUpdateTile(cell, originalPos, cellWidth) {
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
        const isMoving = originalPos &&
            (originalPos.row !== this.currentRow || originalPos.col !== this.currentCol);

        if (!isMoving) {
            tile.style.transition = 'none';  // 不移动时禁用过渡动画
        } else {
            tile.style.transition = 'left 0.15s ease, top 0.15s ease';
        }

        // 计算并设置方块位置
        tile.style.width = `${cellWidth}px`;
        const { left, top } = this.getTilePosition(this.currentRow, this.currentCol, cellWidth);
        tile.style.left = `${left}px`;
        tile.style.top = `${top}px`;

        return tile;
    }

    /**
     * 带动画效果更新界面
     * @param {Object} originalPositions - 移动前的方块位置
     */
    updateUIWithAnimation(originalPositions) {
        const { cellWidth } = this.getTileMetrics();

        // 收集所有当前存在的方块ID
        const newTileIds = new Set();
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) newTileIds.add(cell.id);
            }
        }

        // 移除已消失的方块（被合并的）
        const tiles = this.gameBoard.querySelectorAll('.tile');
        tiles.forEach(tile => {
            const tileId = parseInt(tile.dataset.tileId, 10);
            if (!newTileIds.has(tileId)) tile.remove();
        });

        // 更新或创建每个方块的显示
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                const cell = this.board[i][j];
                if (cell.id !== null) {
                    // 将行列索引临时挂到this，供createOrUpdateTile使用
                    this.currentRow = i;
                    this.currentCol = j;
                    this.createOrUpdateTile(cell, originalPositions[cell.id], cellWidth);
                }
            }
        }

        this.updateScoreDisplay();
    }

    /**
     * 初始化界面（不带移动动画）
     */
    updateUI() {
        this.gameBoard.innerHTML = '';

        // 创建背景格子（16个）
        for (let i = 0; i < this.SIZE * this.SIZE; i++) {
            const container = document.createElement('div');
            container.className = 'tile-container';
            this.gameBoard.appendChild(container);
        }

        // 创建每个方块元素
        const { cellWidth } = this.getTileMetrics();
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
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
                    tile.style.width = `${cellWidth}px`;
                    const { left, top } = this.getTilePosition(i, j, cellWidth);
                    tile.style.left = `${left}px`;
                    tile.style.top = `${top}px`;

                    this.gameBoard.appendChild(tile);
                }
            }
        }

        this.updateScoreDisplay();
    }

    /**
     * 更新得分与最高分显示
     */
    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore(this.bestScore);
        }
        this.bestScoreElement.textContent = this.bestScore;
    }

    /**
     * 检查是否达到胜利条件（达到2048）
     */
    checkWin() {
        if (this.hasWon) return;

        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                if (this.board[i][j].value === this.WIN_VALUE) {
                    this.hasWon = true;
                    if (confirm('恭喜！你达到了2048！继续游戏吗？')) {
                        return;  // 继续游戏（允许超过2048）
                    }
                    this.startNewGame();  // 重新开始
                    return;
                }
            }
        }
    }

    /**
     * 检查游戏是否结束（无法移动且无空格子）
     */
    checkGameOver() {
        for (let i = 0; i < this.SIZE; i++) {
            for (let j = 0; j < this.SIZE; j++) {
                // 如果有空格子，游戏未结束
                if (this.board[i][j].value === 0) return;

                // 如果水平方向有相同数字可合并，游戏未结束
                if (j < this.SIZE - 1 && this.board[i][j].value === this.board[i][j + 1].value) return;

                // 如果垂直方向有相同数字可合并，游戏未结束
                if (i < this.SIZE - 1 && this.board[i][j].value === this.board[i + 1][j].value) return;
            }
        }
        // 所有格子已满且无法合并，游戏结束
        alert(`游戏结束！你的得分：${this.score}`);
        this.startNewGame();
    }

    /**
     * 从本地存储加载历史最高分
     * @returns {number} 历史最高分（无记录则返回0）
     */
    loadBestScore() {
        const saved = localStorage.getItem(this.STORAGE_KEY_BEST);
        return saved ? parseInt(saved, 10) : 0;
    }

    /**
     * 保存最高分到本地存储
     * @param {number} score - 要保存的分数
     */
    saveBestScore(score) {
        localStorage.setItem(this.STORAGE_KEY_BEST, score.toString());
    }
}

// DOM加载完成后初始化游戏（仅当默认DOM元素存在时，避免在站点合集中重复创建）
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('gameBoard')
        && document.getElementById('score')
        && document.getElementById('bestScore')
        && document.getElementById('newGame')) {
        new Game2048();
    }
});

// 暴露基础类供其他页面复用（避免重复代码）
// 子类只需在构造函数中覆盖DOM元素ID即可适配不同页面结构
window.Game2048Base = Game2048;
